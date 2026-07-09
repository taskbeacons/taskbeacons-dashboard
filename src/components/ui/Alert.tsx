import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  if (!message) return null;

  const isError = type === 'error';
  const Icon = isError ? AlertCircle : CheckCircle2;
  const containerClasses = isError 
    ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${containerClasses}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-tight">{message}</p>
    </div>
  );
};
