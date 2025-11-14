import { SparePartWithUrgency } from '../types';

/**
 * Binary search to find a part by name
 * Assumes the array is sorted alphabetically by name
 */
export function binarySearchByName(
  parts: SparePartWithUrgency[],
  searchName: string
): SparePartWithUrgency | null {
  // First, sort by name for binary search
  const sorted = [...parts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midName = sorted[mid].name.toLowerCase();
    const searchLower = searchName.toLowerCase();

    if (midName === searchLower) {
      return sorted[mid];
    } else if (midName < searchLower) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
}

/**
 * Linear search with case-insensitive partial matching
 * Useful for finding parts when exact name isn't known
 */
export function searchPartsByName(
  parts: SparePartWithUrgency[],
  searchTerm: string
): SparePartWithUrgency[] {
  const searchLower = searchTerm.toLowerCase();
  return parts.filter((part) =>
    part.name.toLowerCase().includes(searchLower)
  );
}

