import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border border-transparent text-[#0a0a0a] bg-[#00d4b4] hover:bg-[#00b89e] focus:ring-[#00d4b4]",
    outline: "border border-white/10 text-white bg-transparent hover:bg-white/5 focus:ring-white/20"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${variant === 'primary' ? 'border-black' : 'border-white'}`}></div>
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
