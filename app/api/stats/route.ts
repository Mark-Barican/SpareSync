import { NextRequest, NextResponse } from 'next/server';
import { getPartStatistics } from '@/lib/database';

// GET /api/stats
// Description: Retrieves overall statistics for spare parts.
// Example Request:
// GET /api/stats
// Example Response (200 OK):
// {
//   "totalParts": 100,
//   "partsBelowReorder": 15,
//   "averageCost": 28.75
// }
// Example Error Response (500 Internal Server Error):
// {
//   "error": "Failed to retrieve part statistics"
// }

export async function GET(request: NextRequest) {
    try {
        const stats = await getPartStatistics();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Failed to retrieve part statistics:', error);
        return NextResponse.json({ error: 'Failed to retrieve part statistics' }, { status: 500 });
    }
}
