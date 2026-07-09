import React, { forwardRef } from 'react';


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5">
          {label}
        </label>
        <div className="relative rounded-md shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full 
              ${Icon ? 'pl-10' : 'pl-4'} pr-3 py-2.5 
              bg-black border 
              ${error ? 'border-red-500/50' : 'border-white/10'} 
              rounded-xl 
              focus:outline-none focus:border-brand/50 
              text-white placeholder-white/20 text-sm transition-all
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
