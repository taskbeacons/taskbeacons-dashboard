import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, ArrowLeft, LayoutDashboard, Menu, 
  Terminal, ShieldCheck, Activity, Wifi, Server
} from 'lucide-react';

interface NotFoundProps {
  onMenuOpen?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onMenuOpen }) => {
  const navigate = useNavigate();

  // Simulated typing effect for terminal lines
  const terminalLines = [
    '> locating route...',
    '> ERROR: route unresolved (404)',
    '> scanning navigation index...',
    '> standing by for officer command...'
  ];

  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const fullLine = terminalLines[currentLineIndex];
      if (currentCharIndex < fullLine.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            newLines[currentLineIndex] = fullLine.slice(0, currentCharIndex + 1);
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 35);
        return () => clearTimeout(timeout);
      } else {
        const lineTimeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(lineTimeout);
      }
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 sm:space-y-8 max-w-5xl mx-auto py-4 sm:py-8"
    >
      {/* Top Banner / Hero Card */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl lg:rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        {/* Subtle Ambient Scan Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>ERROR // 404_PAGE_NOT_FOUND</span>
          </div>

          {/* Giant Numeric 404 Header */}
          <div className="relative">
            <h1 className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 select-none">
              404
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-brand rounded-full blur-sm" />
          </div>

          {/* Main Title & Description */}
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-mono uppercase tracking-wider text-white">
              Page Not Found
            </h2>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
              The requested dashboard route does not exist. The resource may have been removed, renamed, or the URL address is incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00d4b4] hover:bg-[#00b89e] text-[#0a0a0a] font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,212,180,0.2)] hover:shadow-[0_0_25px_rgba(0,212,180,0.4)] cursor-pointer"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard Home</span>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            {onMenuOpen && (
              <button
                onClick={onMenuOpen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/10 hover:border-brand/40 text-white/70 hover:text-white font-bold font-mono text-xs uppercase tracking-wider transition-all lg:hidden"
              >
                <Menu size={16} />
                <span>Open Navigation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Section: Terminal Window & Telemetry Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Fake Terminal Window */}
        <div className="lg:col-span-7 bg-[#121212] border border-white/5 rounded-2xl p-4 sm:p-6 font-mono text-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[11px] text-white/40 ml-2">terminal@taskbeacons:~</span>
            </div>
            <Terminal size={14} className="text-white/30" />
          </div>

          <div className="bg-black/60 border border-white/5 rounded-xl p-4 min-h-[140px] text-[#00d4b4] space-y-2 select-text font-mono text-[11px] leading-relaxed">
            {displayedLines.map((line, idx) => (
              <div key={idx} className={idx === 1 ? 'text-red-400 font-bold' : ''}>
                {line}
              </div>
            ))}
            {currentLineIndex < terminalLines.length && (
              <span className="inline-block w-2 h-3.5 bg-brand animate-pulse align-middle ml-1" />
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/30 uppercase tracking-wider">
            <span>Shell: zsh / bash</span>
            <span>Protocol: HTTPS // TLS_v1.3</span>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="lg:col-span-5 bg-[#121212] border border-white/5 rounded-2xl p-4 sm:p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold uppercase text-white tracking-wider">System Diagnostic</h3>
            <Activity size={14} className="text-brand" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Error Code</span>
              <span className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                404
              </span>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">System Status</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Server size={14} />
                Online
              </span>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Network</span>
              <span className="text-sm font-bold text-brand flex items-center gap-1.5">
                <Wifi size={14} />
                Connected
              </span>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <span className="text-[10px] text-white/40 uppercase block">Auth Session</span>
              <span className="text-sm font-bold text-brand flex items-center gap-1.5">
                <ShieldCheck size={14} />
                Verified
              </span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
