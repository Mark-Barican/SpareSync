import { SparePartWithUrgency } from '../types';

/**
 * QuickSort implementation for sorting parts by urgency
 * Sorts in descending order (most urgent first)
 */
export function quickSortByUrgency(
  parts: SparePartWithUrgency[],
  left: number = 0,
  right: number = parts.length - 1
): SparePartWithUrgency[] {
  if (left < right) {
    const pivotIndex = partition(parts, left, right);
    quickSortByUrgency(parts, left, pivotIndex - 1);
    quickSortByUrgency(parts, pivotIndex + 1, right);
  }
  return parts;
}

function partition(
  parts: SparePartWithUrgency[],
  left: number,
  right: number
): number {
  const pivot = parts[right].urgency;
  let i = left - 1;

  for (let j = left; j < right; j++) {
    // Sort by urgency descending (most urgent/negative first)
    if (parts[j].urgency <= pivot) {
      i++;
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
  }
  [parts[i + 1], parts[right]] = [parts[right], parts[i + 1]];
  return i + 1;
}

/**
 * MergeSort implementation for sorting parts by urgency
 * Sorts in descending order (most urgent first)
 */
export function mergeSortByUrgency(
  parts: SparePartWithUrgency[]
): SparePartWithUrgency[] {
  if (parts.length <= 1) {
    return parts;
  }

  const mid = Math.floor(parts.length / 2);
  const left = mergeSortByUrgency(parts.slice(0, mid));
  const right = mergeSortByUrgency(parts.slice(mid));

  return merge(left, right);
}

function merge(
  left: SparePartWithUrgency[],
  right: SparePartWithUrgency[]
): SparePartWithUrgency[] {
  const result: SparePartWithUrgency[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    // Sort by urgency descending (most urgent/negative first)
    if (left[leftIndex].urgency <= right[rightIndex].urgency) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

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

