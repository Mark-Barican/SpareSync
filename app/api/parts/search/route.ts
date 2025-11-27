import { NextRequest, NextResponse } from 'next/server';
import { searchParts } from '@/lib/database';
import { SparePart } from '@/app/types';

// GET /api/parts/search?q={searchTerm}
// Description: Searches for spare parts by name.
// Example Request:
// GET /api/parts/search?q=engine
// Example Response (200 OK):
// [
//   {
//     "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
//     "name": "Engine Filter",
//     "currentStock": 50,
//     "reorderPoint": 10,
//     "supplierLeadTime": 7,
//     "cost": 15.75
//   }
// ]
// Example Error Response (400 Bad Request):
// {
//   "error": "Query parameter \"q\" is required"
// }
// Example Error Response (500 Internal Server Error):
// {
//   "error": "Failed to search parts"
// }

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');

    if (!searchTerm) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const parts = await searchParts(searchTerm);

        const result: SparePart[] = parts.map((part: any) => ({
            id: part.id,
            name: part.name,
            currentStock: part.current_stock,
            reorderPoint: part.reorder_point,
            supplierLeadTime: part.supplier_lead_time,
            cost: part.cost,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to search parts:', error);
        return NextResponse.json({ error: 'Failed to search parts' }, { status: 500 });
    }
}
