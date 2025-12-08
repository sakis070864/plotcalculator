import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'amber' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  trend,
  color = 'slate' 
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    slate: 'bg-white text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const iconStyles = {
    blue: 'bg-white text-blue-900 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-white text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    amber: 'bg-white text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    slate: 'bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorStyles[color]} relative overflow-hidden transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {subValue && <p className="text-xs font-medium mt-1 opacity-70">{subValue}</p>}
        </div>
        <div className={`p-2 rounded-lg shadow-sm ${iconStyles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};