import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputCardProps {
  label: string;
  value: number;
  onChange?: (val: number) => void;
  icon: LucideIcon;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  helperText?: string;
  highlight?: boolean;
  readOnly?: boolean;
  action?: React.ReactNode;
}

export const InputCard: React.FC<InputCardProps> = ({
  label,
  value,
  onChange,
  icon: Icon,
  unit,
  step = 1,
  min = 0,
  max,
  helperText,
  highlight = false,
  readOnly = false,
  action,
}) => {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 ${
      highlight 
        ? 'bg-blue-50 border-blue-900/30 dark:bg-blue-900/20 dark:border-blue-700 shadow-sm' 
        : readOnly
          ? 'bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-700'
          : 'bg-white border-slate-200 hover:border-blue-800 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Icon size={18} className={highlight ? "text-blue-900 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"} />
          <label className="text-sm font-medium">{label}</label>
        </div>
        {action}
      </div>
      
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ''}
          onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)}
          readOnly={readOnly}
          className={`w-full text-2xl font-bold bg-transparent outline-none focus:ring-0 ${
            highlight 
              ? 'text-blue-950 dark:text-blue-100' 
              : readOnly 
                ? 'text-slate-500 dark:text-slate-500 cursor-not-allowed' 
                : 'text-slate-900 dark:text-white'
          }`}
          placeholder="0"
        />
        {unit && <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">{unit}</span>}
      </div>
      
      {helperText && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{helperText}</p>
      )}
    </div>
  );
};