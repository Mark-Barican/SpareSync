'use client';

import { SparePart } from '../types';
import { useState } from 'react';

interface PartFormProps {
  onAddPart: (part: SparePart) => void;
}

export default function PartForm({ onAddPart }: PartFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    currentStock: '',
    reorderPoint: '',
    supplierLeadTime: '',
    cost: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      currentStock: parseInt(formData.currentStock) || 0,
      reorderPoint: parseInt(formData.reorderPoint) || 0,
      supplierLeadTime: parseInt(formData.supplierLeadTime) || 0,
      cost: parseFloat(formData.cost) || 0,
    };

    try {
      const request = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (request.status !== 201) {
        console.error('Failed to create part');
        setSubmitting(false);
        return;
      }

      const reqData = await request.json();

      const newPart: SparePart = {
        id: reqData.id,
        name: reqData.name,
        currentStock: reqData.currentStock,
        reorderPoint: reqData.reorderPoint,
        supplierLeadTime: reqData.supplierLeadTime,
        cost: reqData.cost,
      };

      onAddPart(newPart);
      
      // Reset form
      setFormData({
        name: '',
        currentStock: '',
        reorderPoint: '',
        supplierLeadTime: '',
        cost: '',
      });
    } catch (error) {
      console.error('Error creating part:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Part Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Part name"
          />
        </div>
        <div>
          <label htmlFor="currentStock" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Current Stock
          </label>
          <input
            type="number"
            id="currentStock"
            required
            min="0"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="reorderPoint" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Min Stock
          </label>
          <input
            type="number"
            id="reorderPoint"
            required
            min="0"
            value={formData.reorderPoint}
            onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="supplierLeadTime" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Delivery (days)
          </label>
          <input
            type="number"
            id="supplierLeadTime"
            required
            min="0"
            value={formData.supplierLeadTime}
            onChange={(e) => setFormData({ ...formData, supplierLeadTime: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="cost" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Cost ($)
          </label>
          <input
            type="number"
            id="cost"
            required
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Adding...' : 'Add Part'}
      </button>
    </form>
  );
}
