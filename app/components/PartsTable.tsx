'use client';

import { useState, useEffect } from 'react';
import { SparePartWithUrgency } from '../types';
import { SortField, SortDirection } from '../utils/sorting';

interface PartsTableProps {
  parts: SparePartWithUrgency[];
  sortField: SortField;
  sortDirection: SortDirection;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function PartsTable({ parts, sortField, sortDirection, onDelete, loading }: PartsTableProps) {
  const [displayedParts, setDisplayedParts] = useState<SparePartWithUrgency[]>(parts);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setDisplayedParts(parts);
      setIsAnimating(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [parts]);

  const getPriorityColor = (urgency: number) => {
    if (urgency < 0) return 'text-red-600 dark:text-red-400';
    if (urgency < 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getStatusBadge = (urgency: number, needsReorder: boolean) => {
    if (needsReorder) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          Critical
        </span>
      );
    }
    if (urgency < 5) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
          Low
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
        OK
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
        <div className="inline-flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-blue-600 dark:border-t-blue-400 rounded-full spinner"></div>
          <span>Loading parts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Part Name
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Min Stock
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Delivery
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {displayedParts.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No parts found. {loading ? 'Loading...' : 'Add parts using the form above or load test data.'}
              </td>
            </tr>
          ) : (
            displayedParts.map((part, index) => (
              <tr
                key={part.id}
                style={{
                  animation: `fadeIn 0.4s ease-out ${Math.min(index * 0.02, 0.3)}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className={`table-row hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-opacity duration-200 ${
                  isAnimating ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <td className="px-3 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors">
                  {part.name}
                </td>
                <td className="px-3 py-2 text-sm text-right text-zinc-700 dark:text-zinc-300 transition-colors">
                  {part.currentStock}
                </td>
                <td className="px-3 py-2 text-sm text-right text-zinc-700 dark:text-zinc-300 transition-colors">
                  {part.reorderPoint}
                </td>
                <td className={`px-3 py-2 text-sm text-right font-semibold transition-colors ${getPriorityColor(part.urgency)}`}>
                  {part.urgency > 0 ? '+' : ''}{part.urgency}
                </td>
                <td className="px-3 py-2 text-sm text-right text-zinc-700 dark:text-zinc-300 transition-colors">
                  {part.supplierLeadTime}d
                </td>
                <td className="px-3 py-2 text-sm text-right text-zinc-700 dark:text-zinc-300 transition-colors">
                  {formatCurrency(part.cost)}
                </td>
                <td className="px-3 py-2 text-center transition-colors">
                  {getStatusBadge(part.urgency, part.needsReorder)}
                </td>
                <td className="px-3 py-2 text-center transition-colors">
                  <button
                    onClick={() => onDelete(part.id)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-all duration-200 hover:scale-105"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
