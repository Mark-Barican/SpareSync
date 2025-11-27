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

export interface GetPartsResponse {
  parts: SparePartWithUrgency[];
  total: number;
  needsReorderCount: number;
}

export interface PartsStats {
    totalParts: number;
    partsNeedingReorder: number;
    partsWithAdequateStock: number;
    totalInventoryValue: number;
    averageLeadTime: number;
}
