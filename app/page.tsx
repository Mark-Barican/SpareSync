'use client';

import { useState, useMemo, useEffect } from 'react';
import { SparePart, SparePartWithUrgency } from './types';
import { quickSortByUrgency, mergeSortByUrgency } from './utils/sorting';
import { binarySearchByName, searchPartsByName } from './utils/search';
import { calculatePartsUrgency, generateSampleParts } from './utils/parts';
import PartsTable from './components/PartsTable';
import PartForm from './components/PartForm';

export default function Home() {
// search for resource getting the parts from the database that the database.ts file provides
  const [parts, setParts] = useState<SparePart[]>([]);
  const [sortAlgorithm, setSortAlgorithm] = useState<'quicksort' | 'mergesort'>('quicksort');
  const [searchTerm, setSearchTerm] = useState('');
  const [useBinarySearch, setUseBinarySearch] = useState(false);

  // Calculate urgency for all parts
  const partsWithUrgency = useMemo(() => {
    return calculatePartsUrgency(parts);
  }, [parts]);

  // Sort parts by urgency
  const sortedParts = useMemo(() => {
    const partsCopy = [...partsWithUrgency];
    if (sortAlgorithm === 'quicksort') {
      return quickSortByUrgency(partsCopy);
    } else {
      return mergeSortByUrgency(partsCopy);
    }
  }, [partsWithUrgency, sortAlgorithm]);

  // Search functionality
  const filteredParts = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedParts;
    }

    if (useBinarySearch) {
      const found = binarySearchByName(sortedParts, searchTerm);
      return found ? [found] : [];
    } else {
      return searchPartsByName(sortedParts, searchTerm);
    }
  }, [sortedParts, searchTerm, useBinarySearch]);

  const handleAddPart = (part: SparePart) => {
    setParts([...parts, part]);
  };

  const handleDeletePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleLoadSample = () => {
    setParts(generateSampleParts());
    setSearchTerm('');
  };

  const needsReorderCount = sortedParts.filter((p) => p.needsReorder).length;

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/parts');
        if (!response.ok) {
          console.error('Failed to load parts from API', await response.text());
          return;
        }
        const content: SparePart[] = await response.json();
        setParts(content);
      } catch (error) {
        console.error('Error fetching parts from API', error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Spare Parts Reordering Assistant
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Prevent downtime by tracking spare parts inventory and identifying urgent reorder needs
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Parts</div>
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {parts.length}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-sm text-red-600 dark:text-red-400 mb-1">High Priority</div>
            <div className="text-3xl font-bold text-red-700 dark:text-red-300">
              {needsReorderCount}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Low Priority</div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {parts.length - needsReorderCount}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Sorting Algorithm
                </label>
                <select
                  value={sortAlgorithm}
                  onChange={(e) => setSortAlgorithm(e.target.value as 'quicksort' | 'mergesort')}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="quicksort">QuickSort</option>
                  <option value="mergesort">MergeSort</option>
                </select>
              </div>
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium rounded-md transition-colors"
              >
                Load Sample Data
              </button>
            </div>
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Search Parts
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by part name..."
                  className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useBinarySearch}
                    onChange={(e) => setUseBinarySearch(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">Binary Search</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Add Part Form */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Add New Part
          </h2>
          <PartForm onAddPart={handleAddPart} />
        </div>

        {/* Parts Table */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Parts Inventory (Sorted by Priority Level)
            </h2>
            {searchTerm && (
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {filteredParts.length} result{filteredParts.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
          <PartsTable parts={filteredParts} sortAlgorithm={sortAlgorithm} />
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How It Works
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>
              <strong>Priority Level Calculation:</strong> Priority Level = Current Stock - Minimum Stock
            </li>
            <li>
              <strong>Negative values</strong> indicate parts that need immediate reordering
            </li>
            <li>
              <strong>Sorting:</strong> Parts are sorted by urgency (most urgent first) using
              {sortAlgorithm === 'quicksort' ? ' QuickSort' : ' MergeSort'} algorithm
            </li>
            <li>
              <strong>Search:</strong> Use binary search for exact name matches, or linear search
              for partial matches
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
