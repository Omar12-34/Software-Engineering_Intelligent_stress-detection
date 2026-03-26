import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

type MetricCardProps = {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  colorClass: string; // e.g., "text-blue-600"
  bgClass: string; // e.g., "bg-blue-50"
  description?: string;
};

export function MetricCard({ title, value, unit, icon: Icon, trend, colorClass, bgClass, description }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          <span className="text-sm font-medium text-gray-500">{unit}</span>
        </div>
        {description && (
            <p className="text-xs text-gray-400 mt-2">{description}</p>
        )}
      </div>
      <div className={clsx("p-3 rounded-lg", bgClass, colorClass)}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
