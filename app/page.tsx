'use client';

import { useState, useMemo, useEffect } from 'react';
import { SparePart, SparePartWithUrgency } from './types';
import { sortParts, SortField, SortDirection } from './utils/sorting';
import { searchPartsByName } from './utils/search';
import { calculatePartsUrgency, generateSampleParts } from './utils/parts';
import PartsTable from './components/PartsTable';
import PartForm from './components/PartForm';

export default function Home() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Calculate urgency for all parts
  const partsWithUrgency = useMemo(() => {
    return calculatePartsUrgency(parts);
  }, [parts]);

  // Sort parts
  const sortedParts = useMemo(() => {
    return sortParts(partsWithUrgency, sortField, sortDirection);
  }, [partsWithUrgency, sortField, sortDirection]);

  // Search functionality
  const filteredParts = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedParts;
    }
    return searchPartsByName(sortedParts, searchTerm);
  }, [sortedParts, searchTerm]);

  const handleAddPart = (part: SparePart) => {
    setParts([...parts, part]);
    setShowForm(false);
  };

  const handleDeletePart = async (id: string) => {
    try {
      const response = await fetch(`/api/parts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setParts(parts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete part:', error);
    }
  };

  const handleLoadDummyData = async () => {
    const sampleParts = generateSampleParts();
    setLoading(true);
    
    try {
      // Insert each sample part via API
      for (const part of sampleParts) {
        await fetch('/api/parts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: part.name,
            currentStock: part.currentStock,
            reorderPoint: part.reorderPoint,
            supplierLeadTime: part.supplierLeadTime,
            cost: part.cost,
          }),
        });
      }
      
      // Reload parts from API
      const response = await fetch('/api/parts');
      if (response.ok) {
        const data = await response.json();
        setParts(data);
      }
    } catch (error) {
      console.error('Failed to load dummy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const needsReorderCount = sortedParts.filter((p) => p.needsReorder).length;

  useEffect(() => {
    (async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Compact Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                SpareSync
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Inventory management & reorder tracking
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLoadDummyData}
                disabled={loading}
                className="px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium rounded transition-colors disabled:opacity-50"
              >
                Test Data
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add Part'}
              </button>
            </div>
          </div>
        </header>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Total</div>
            <div className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {parts.length}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
            <div className="text-xs text-red-600 dark:text-red-400 mb-0.5">High Priority</div>
            <div className="text-xl font-semibold text-red-700 dark:text-red-300">
              {needsReorderCount}
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Low Priority</div>
            <div className="text-xl font-semibold text-green-700 dark:text-green-300">
              {parts.length - needsReorderCount}
            </div>
          </div>
        </div>

        {/* Compact Form (Collapsible) */}
        {showForm && (
          <div className="bg-white dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800 mb-4">
            <PartForm onAddPart={handleAddPart} />
          </div>
        )}

        {/* Compact Controls */}
        <div className="bg-white dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Sort by:
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="priority">Priority Level</option>
                <option value="name">Name</option>
                <option value="stock">Current Stock</option>
                <option value="cost">Cost</option>
                <option value="delivery">Delivery Time</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Order:
              </label>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search parts..."
                className="w-full px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {searchTerm && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {filteredParts.length} result{filteredParts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Compact Table */}
        <div className="bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <PartsTable 
            parts={filteredParts} 
            sortField={sortField}
            sortDirection={sortDirection}
            onDelete={handleDeletePart}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
