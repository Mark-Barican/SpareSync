import { NextResponse, NextRequest } from 'next/server';
import { generateSampleParts } from '@/app/utils/parts'; // generateSampleParts is commented out in parts.ts
import { parts, getParts, createPart } from '../../../lib/database';
import { SparePart } from '@/app/types';

// ./api/parts -> JSON containing all parts.
export async function GET(request: NextRequest) {
  try {
    const parts = await getParts();
    const result : SparePart[] = [];

    for (const idx in parts) {
      const part = parts[idx];

      const data : SparePart = {
        id: part.id,
        name: part.name,
        currentStock: part.current_stock,
        reorderPoint: part.reorder_point,
        supplierLeadTime: part.supplier_lead_time,
        cost: part.cost,
      }

      result.push(data);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to retrieve parts:', error);
    return NextResponse.json({ error: 'Failed to retrieve parts' }, { status: 500 });
  }
}

// POST ./api/parts -> creating a new part resource.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, currentStock, reorderPoint, supplierLeadTime, cost } = body;

  // Data validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Name is required and must be a non-empty string' }, { status: 400 });
  }
  if (typeof currentStock !== 'number' || currentStock < 0) {
    return NextResponse.json({ error: 'Current Stock must be a non-negative number' }, { status: 400 });
  }
  if (typeof reorderPoint !== 'number' || reorderPoint < 0) {
    return NextResponse.json({ error: 'Reorder Point must be a non-negative number' }, { status: 400 });
  }
  if (typeof supplierLeadTime !== 'number' || supplierLeadTime < 0) {
    return NextResponse.json({ error: 'Supplier Lead Time must be a non-negative number' }, { status: 400 });
  }
  if (typeof cost !== 'number' || cost < 0) {
    return NextResponse.json({ error: 'Cost must be a non-negative number' }, { status: 400 });
  }

  const part: parts = { name, currentStock, reorderPoint, supplierLeadTime, cost };
  
  try {
    const action = await createPart(part);

    const result : SparePart[] = [];

    for (const idx in action) {
      const part = action[idx];

      const data : SparePart = {
        id: part.id,
        name: part.name,
        currentStock: part.current_stock,
        reorderPoint: part.reorder_point,
        supplierLeadTime: part.supplier_lead_time,
        cost: part.cost,
      }

      result.push(data);
    }

    return NextResponse.json(result[0], {
      status: 201,
    });
  } catch (error) {
      console.error('Failed to create part:', error);
      return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
  }
}