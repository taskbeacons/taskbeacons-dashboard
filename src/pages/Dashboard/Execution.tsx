import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trash2, Cpu, Activity, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ResponsiveContainer, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

const INITIAL_MOCK_LOGS = [
  'SYSTEM: Booting AI Agent container sandbox context...',
  'DOCKER: Container initialized. Memory limit: 2048MB. CPU share: 2 cores.',
  'ORCHESTRATOR: Sync pipeline "SyncCRMContacts" registered at route /v1/workflow/run.',
  'SYSTEM: Fetching target keys from vault database connection...',
  'AGENT [AutoCoder-Alpha]: Acquired task tsk-940. Processing code refactor check.',
  'AGENT [AutoCoder-Alpha]: Running AST scan against main.tsx...',
  'AGENT [AutoCoder-Alpha]: Lint check completed. 0 critical errors flagged.',
];

const ADDON_MOCK_LOGS = [
  'SYSTEM: Syncing telemetry node indices...',
  'AGENT [SecOps-Sentinel]: Initializing deep security scan of repository new2/web...',
  'SECURITY: Found 0 high severity advisories, 2 low severity packages flagged.',
  'ORCHESTRATOR: Task queue polling complete. Dispatching tsk-941...',
  'AGENT [MarketIntel-Extractor]: Initialized browser session at endpoint target: search_web...',
  'SYSTEM: CPU thermal levels stable. Memory fragmentation 2.4%.',
  'SYSTEM: Successfully synced DB indexes to server pool region us-east.'
];

export const Execution: React.FC = () => {
  const toast = useToast();
  const [logs, setLogs] = useState<string[]>(INITIAL_MOCK_LOGS);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Resource metrics simulation
  const [metricsHistory, setMetricsHistory] = useState<{ time: string; cpu: number; ram: number }[]>([
    { time: '1', cpu: 12, ram: 42 },
    { time: '2', cpu: 25, ram: 43 },
    { time: '3', cpu: 18, ram: 43 },
    { time: '4', cpu: 45, ram: 45 },
    { time: '5', cpu: 32, ram: 45 },
    { time: '6', cpu: 15, ram: 44 },
    { time: '7', cpu: 60, ram: 48 },
  ]);

  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Append random log
      const randomLog = ADDON_MOCK_LOGS[Math.floor(Math.random() * ADDON_MOCK_LOGS.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${timestamp}] ${randomLog}`].slice(-40)); // keep last 40 logs

      // Update metrics
      setMetricsHistory(prev => {
        const nextCpu = Math.floor(Math.random() * 55) + 10;
        const nextRam = Math.floor(Math.random() * 10) + 40;
        return [...prev.slice(1), { time: String(prev.length + 1), cpu: nextCpu, ram: nextRam }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  useEffect(() => {
    if (logsContainerRef.current) {
      const container = logsContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  const handleClearLogs = () => {
    setLogs([]);
    toast.showToast('Terminal logs cleared.', 'info');
  };

  const handleDownloadLogs = () => {
    toast.showToast('Generating terminal logs file download...', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Live Execution Shell
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Real-time logs stream and sandbox resource monitors.
          </p>
        </div>

        <div className="flex flex-col w-full sm:flex-row sm:w-auto sm:flex-wrap items-stretch sm:items-center gap-3">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`w-full sm:w-auto justify-center px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center gap-2 border ${
              isLiveStreaming 
                ? 'bg-brand/10 border-brand/20 text-brand' 
                : 'bg-white/5 border-white/10 text-white/50'
            }`}
          >
            {isLiveStreaming ? <Pause size={14} /> : <Play size={14} />}
            {isLiveStreaming ? 'PAUSE STREAM' : 'STREAM LOGS'}
          </button>
          <button
            onClick={handleDownloadLogs}
            className="w-full sm:w-auto justify-center px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-2 transition-all"
          >
            <Download size={14} /> DOWNLOAD
          </button>
          <button
            onClick={handleClearLogs}
            className="w-full sm:w-auto justify-center px-4 py-2 border border-red-500/20 hover:border-red-500/40 text-red-400 bg-red-500/5 rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-2 transition-all"
          >
            <Trash2 size={14} /> CLEAR
          </button>
        </div>
      </div>

      {/* Grid containing logs console and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal window */}
        <div className="lg:col-span-2 bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[450px]">
          <div className="p-4 border-b border-white/5 bg-[#0e0e0e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand/80 animate-pulse"></div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-white/35 ml-2 uppercase">
                stdout / telemetry stream
              </span>
            </div>
            {isLiveStreaming && (
              <span className="text-[9px] font-mono text-brand flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping"></span> LIVE
              </span>
            )}
          </div>

          <div 
            ref={logsContainerRef}
            className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed text-white/60 space-y-2 select-text"
          >
            {logs.length === 0 ? (
              <div className="text-white/20 text-center py-20 uppercase tracking-wider">
                Console logs are empty.
              </div>
            ) : (
              logs.map((log, idx) => {
                let colorClass = 'text-white/60';
                if (log.includes('SYSTEM')) colorClass = 'text-purple-400';
                else if (log.includes('SECURITY')) colorClass = 'text-red-400';
                else if (log.includes('ORCHESTRATOR')) colorClass = 'text-brand';
                else if (log.includes('AGENT')) colorClass = 'text-blue-400';

                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resources container */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-6">Orchestration CPU Share</h3>
            
            {/* Minimal line chart */}
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Line type="monotone" dataKey="cpu" stroke="#00D4B4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5 font-mono">
              <div>
                <span className="text-[9px] text-white/30 uppercase flex items-center gap-1.5">
                  <Cpu size={12} className="text-brand" /> CPU Load
                </span>
                <span className="text-lg font-black text-white block mt-1">
                  {metricsHistory[metricsHistory.length - 1]?.cpu}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-white/30 uppercase flex items-center gap-1.5">
                  <Activity size={12} className="text-brand" /> Memory Load
                </span>
                <span className="text-lg font-black text-white block mt-1">
                  {metricsHistory[metricsHistory.length - 1]?.ram}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-white/5 bg-black/30 rounded-2xl text-[10px] text-white/40 leading-relaxed font-mono mt-6">
            Sandbox boundaries restricted. Max CPU priority: High. Network tunneling: Closed.
          </div>
        </div>
      </div>
    </div>
  );
};
