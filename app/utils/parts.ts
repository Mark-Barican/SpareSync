import { SparePart, SparePartWithUrgency } from '../types';
import { calculateUrgency } from './sorting';

/**
 * Transform spare parts to include urgency calculations
 */
export function calculatePartsUrgency(
  parts: SparePart[]
): SparePartWithUrgency[] {
  return parts.map((part) => {
    const urgency = calculateUrgency(part);
    return {
      ...part,
      urgency,
      needsReorder: urgency < 0,
    };
  });
}

/**
 * Generate sample/mock data for testing
 */
export function generateSampleParts(): SparePart[] {
  return [
    {
      id: '1',
      name: 'Hydraulic Pump Seal',
      currentStock: 2,
      reorderPoint: 5,
      supplierLeadTime: 7,
      cost: 45.99,
    },
    {
      id: '2',
      name: 'Bearing Assembly',
      currentStock: 12,
      reorderPoint: 10,
      supplierLeadTime: 14,
      cost: 125.50,
    },
    {
      id: '3',
      name: 'Conveyor Belt',
      currentStock: 0,
      reorderPoint: 3,
      supplierLeadTime: 21,
      cost: 350.00,
    },
    {
      id: '4',
      name: 'Motor Brush Set',
      currentStock: 8,
      reorderPoint: 15,
      supplierLeadTime: 5,
      cost: 28.75,
    },
    {
      id: '5',
      name: 'Control Valve',
      currentStock: 1,
      reorderPoint: 4,
      supplierLeadTime: 10,
      cost: 89.99,
    },
    {
      id: '6',
      name: 'Gasket Kit',
      currentStock: 20,
      reorderPoint: 12,
      supplierLeadTime: 3,
      cost: 15.25,
    },
    {
      id: '7',
      name: 'Steel Cable',
      currentStock: 5,
      reorderPoint: 8,
      supplierLeadTime: 14,
      cost: 67.50,
    },
    {
      id: '8',
      name: 'Circuit Board',
      currentStock: 0,
      reorderPoint: 2,
      supplierLeadTime: 30,
      cost: 450.00,
    },
  ];
}

