'use client';

import { SparePartWithUrgency } from '../types';

interface PartsTableProps {
  parts: SparePartWithUrgency[];
  sortAlgorithm: 'quicksort' | 'mergesort';
}

export default function PartsTable({ parts, sortAlgorithm }: PartsTableProps) {
  const getUrgencyColor = (urgency: number) => {
    if (urgency < 0) return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800';
    if (urgency < 5) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800';
    return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800';
  };

  const getUrgencyText = (urgency: number) => {
    if (urgency < 0) return 'Critical - Reorder Now';
    if (urgency < 5) return 'Low Stock - Monitor';
    return 'Adequate Stock';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Sorted using: <span className="font-semibold capitalize">{sortAlgorithm}</span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-zinc-300 dark:border-zinc-700">
            <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100">
              Part Name
            </th>
            <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
              Current Stock
            </th>
            <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
              Reorder Point
            </th>
            <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
              Urgency
            </th>
            <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
              Lead Time (days)
            </th>
            <th className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
              Cost
            </th>
            <th className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-zinc-100">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                No parts to display. Add parts using the form above.
              </td>
            </tr>
          ) : (
            parts.map((part) => (
              <tr
                key={part.id}
                className={`border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${getUrgencyColor(part.urgency)}`}
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {part.name}
                </td>
                <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {part.currentStock}
                </td>
                <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {part.reorderPoint}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">
                  {part.urgency > 0 ? '+' : ''}{part.urgency}
                </td>
                <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {part.supplierLeadTime}
                </td>
                <td className="px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {formatCurrency(part.cost)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      part.needsReorder
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {getUrgencyText(part.urgency)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

