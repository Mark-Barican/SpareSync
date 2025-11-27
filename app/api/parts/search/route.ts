import { NextRequest, NextResponse } from 'next/server';
import { searchParts } from '@/lib/database';
import { SparePart } from '@/app/types';

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
