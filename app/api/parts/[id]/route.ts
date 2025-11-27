import { NextRequest, NextResponse } from 'next/server';
import { updatePart, deletePart, getPartById } from '@/lib/database';
import { SparePart } from '@/app/types';

// GET ./api/parts/[id] -> get a single part resource by ID.
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    try {
        const part = await getPartById(id);

        if (!part) {
            return NextResponse.json({ 'error': 'Part not found' }, { status: 404 });
        }

        const result: SparePart = {
            id: part.id,
            name: part.name,
            currentStock: part.current_stock,
            reorderPoint: part.reorder_point,
            supplierLeadTime: part.supplier_lead_time,
            cost: part.cost,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to retrieve part:', error);
        return NextResponse.json({ 'error': 'Failed to retrieve part' }, { status: 500 });
    }
}

// PATCH ./api/parts/[id] -> get the request body's content, transform into parts.
// using the specified part's id.
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    try {
        const body = await request.json();
        const { name, currentStock, reorderPoint, supplierLeadTime, cost } = body;

        // Data validation (only validate fields if they are provided)
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim() === '') {
                return NextResponse.json({ error: 'Name must be a non-empty string if provided' }, { status: 400 });
            }
        }
        if (currentStock !== undefined) {
            if (typeof currentStock !== 'number' || currentStock < 0) {
                return NextResponse.json({ error: 'Current Stock must be a non-negative number if provided' }, { status: 400 });
            }
        }
        if (reorderPoint !== undefined) {
            if (typeof reorderPoint !== 'number' || reorderPoint < 0) {
                return NextResponse.json({ error: 'Reorder Point must be a non-negative number if provided' }, { status: 400 });
            }
        }
        if (supplierLeadTime !== undefined) {
            if (typeof supplierLeadTime !== 'number' || supplierLeadTime < 0) {
                return NextResponse.json({ error: 'Supplier Lead Time must be a non-negative number if provided' }, { status: 400 });
            }
        }
        if (cost !== undefined) {
            if (typeof cost !== 'number' || cost < 0) {
                return NextResponse.json({ error: 'Cost must be a non-negative number if provided' }, { status: 400 });
            }
        }

        const part: SparePart = body; // The `parts` type should ideally be `Partial<parts>` here
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