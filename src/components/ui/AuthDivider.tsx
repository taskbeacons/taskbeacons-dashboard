import React from 'react';

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = "or continue with" }) => {
  return (
    <div className="relative mt-6 mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/5" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-[#121212] text-white/40 text-xs font-mono uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
};
