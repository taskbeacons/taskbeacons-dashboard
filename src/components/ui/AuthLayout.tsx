import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-grid-pattern border-r border-white/5 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <img src={logo} alt="TaskBeacons Logo" className="h-10 w-auto mb-16" />
          
          <h1 className="text-4xl xl:text-5xl font-black text-white uppercase tracking-tight leading-tight max-w-lg mb-6">
            Build the Future of Autonomous Work
          </h1>
          
          <p className="text-base text-white/50 leading-relaxed max-w-md mb-12">
            Coordinate intelligent AI agents, automate workflows, and scale your business with enterprise-grade task orchestration.
          </p>

          <div className="space-y-4">
            {[
              "AI Workforce",
              "Workflow Automation",
              "Enterprise Security"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20">
                  <CheckCircle2 size={12} className="text-brand" />
                </div>
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider font-mono">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-xs font-mono text-white/30 uppercase tracking-widest">
          © {new Date().getFullYear()} TaskBeacons Inc.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-32 bg-[#0a0a0a] bg-grid-pattern relative overflow-hidden">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <img src={logo} alt="TaskBeacons Logo" className="h-8 w-auto" />
        </div>
        
        {/* Secondary Glow for Form Side */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md mx-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
