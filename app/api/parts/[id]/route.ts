import { NextRequest, NextResponse } from 'next/server';
import { updatePart, deletePart, parts } from '@/lib/database';

// api/parts/{id}
export async function POST(request: NextRequest) {
    return NextResponse.json({
        'message': 'hello world!'
    });
}

// PATCH ./api/parts/[id] -> get the request body's content, transform into parts.
// using the specified part's id.
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    try {
        const part: parts = await request.json();
        await updatePart(id, part);
        return NextResponse.json({
            'id': id,
            'message': 'Content updated!'
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to update part:', error);
        return NextResponse.json({
            'error': 'Failed to update part'
        }, { status: 500 });
    }
}

// DELETE ./api/parts/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    try {
        await deletePart(id);
        return NextResponse.json({
            'id': id,
            'message': 'Content deleted!'
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete part:', error);
        return NextResponse.json({
            'error': 'Failed to delete part'
        }, { status: 500 });
    }
}