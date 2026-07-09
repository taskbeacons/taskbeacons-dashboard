import React, { forwardRef, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showForgotPasswordLink?: boolean;
  onForgotPasswordClick?: () => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Secure Password', error, showForgotPasswordLink, onForgotPasswordClick, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
            {label}
          </label>
          {showForgotPasswordLink && onForgotPasswordClick && (
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs font-medium text-brand hover:text-brand-hover transition-colors"
            >
              Forgot Signature?
            </button>
          )}
        </div>
        
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
            <Lock size={16} />
          </div>
          
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`
              block w-full pl-10 pr-10 py-2.5 
              bg-black border 
              ${error ? 'border-red-500/50' : 'border-white/10'} 
              rounded-xl 
              focus:outline-none focus:border-brand/50 
              text-white placeholder-white/20 text-sm transition-all
              ${className}
            `}
            {...props}
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
