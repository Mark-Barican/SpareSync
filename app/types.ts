export interface SparePart {
  id: string;
  name: string;
  currentStock: number;
  reorderPoint: number;
  supplierLeadTime: number; // in days
  cost: number;
}

export interface SparePartWithUrgency extends SparePart {
  urgency: number; // stock - reorderPoint (negative = needs reorder)
  needsReorder: boolean;
}

