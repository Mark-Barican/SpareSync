import { SparePartWithUrgency } from '../types';

export type SortField = 'priority' | 'name' | 'stock' | 'cost' | 'delivery';
export type SortDirection = 'asc' | 'desc';

/**
 * Calculate urgency for a part
 * Urgency = currentStock - reorderPoint
 * Negative values mean the part needs reordering
 */
export function calculateUrgency(part: {
  currentStock: number;
  reorderPoint: number;
}): number {
  return part.currentStock - part.reorderPoint;
}

/**
 * Sort parts by the specified field and direction
 */
export function sortParts(
  parts: SparePartWithUrgency[],
  field: SortField,
  direction: SortDirection = 'desc'
): SparePartWithUrgency[] {
  const sorted = [...parts];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'priority':
        comparison = a.urgency - b.urgency;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'stock':
        comparison = a.currentStock - b.currentStock;
        break;
      case 'cost':
        comparison = a.cost - b.cost;
        break;
      case 'delivery':
        comparison = a.supplierLeadTime - b.supplierLeadTime;
        break;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}
