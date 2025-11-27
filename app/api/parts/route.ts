import { NextResponse, NextRequest } from 'next/server';
import { generateSampleParts } from '@/app/utils/parts'; // generateSampleParts is commented out in parts.ts
import { parts, getParts, createPart } from '../../../lib/database';
import { SparePart } from '@/app/types';

// ./api/parts -> JSON containing all parts.
export async function GET(request: NextRequest) {
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
}

// POST ./api/parts -> creating a new part resource.
export async function POST(request: NextRequest) {
  const body = await request.json();

  /*
      id: Date.now().toString(),
      name: formData.name,
      currentStock: parseInt(formData.currentStock) || 0,
      reorderPoint: parseInt(formData.reorderPoint) || 0,
      supplierLeadTime: parseInt(formData.supplierLeadTime) || 0,
      cost: parseFloat(formData.cost) || 0,
  */

  const part : parts = body;
  
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
}