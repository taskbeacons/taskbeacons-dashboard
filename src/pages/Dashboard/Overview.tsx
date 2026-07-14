import React, { useState } from 'react';
import { 
  Users, ListTodo, Activity, CheckCircle, Play, 
  Pause, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useToast } from '../../context/ToastContext';

const performanceData = [
  { name: '08:00', tasks: 12, agents: 4, latency: 120 },
  { name: '10:00', tasks: 25, agents: 6, latency: 95 },
  { name: '12:00', tasks: 45, agents: 8, latency: 110 },
  { name: '14:00', tasks: 30, agents: 7, latency: 85 },
  { name: '16:00', tasks: 55, agents: 9, latency: 70 },
  { name: '18:00', tasks: 40, agents: 8, latency: 90 },
  { name: '20:00', tasks: 65, agents: 10, latency: 60 },
];

export const Overview: React.FC = () => {
  const toast = useToast();
  const [workforceStatus, setWorkforceStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  const [isSystemTuning, setIsSystemTuning] = useState(false);

  const toggleWorkforce = () => {
    if (workforceStatus === 'ACTIVE') {
      setWorkforceStatus('PAUSED');
      toast.showToast('Autonomous AI workforce paused globally.', 'info');
    } else {
      setWorkforceStatus('ACTIVE');
      toast.showToast('Autonomous AI workforce resumed execution.', 'success');
    }
  };

  const handleTuneSystem = () => {
    setIsSystemTuning(true);
    toast.showToast('Orchestration engine tuning: optimizing agent route mapping...', 'info');
    setTimeout(() => {
      setIsSystemTuning(false);
      toast.showToast('System optimization completed. Throughput upgraded by 14.8%.', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-brand/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
          <div>
            <h2 className="text-xl font-black uppercase text-white tracking-wide">
              Workforce Command Center
            </h2>
            <p className="text-xs text-white/40 mt-1 leading-relaxed max-w-xl">
              Monitor specialized AI agents, manage execution pipelines, and optimize multi-agent task structures.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-3">
            <button
              onClick={toggleWorkforce}
              className={`w-full sm:w-auto justify-center px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center gap-2 border ${
                workforceStatus === 'ACTIVE' 
                  ? 'bg-brand/10 border-brand/20 text-brand hover:bg-brand/20' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              {workforceStatus === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
              {workforceStatus === 'ACTIVE' ? 'PAUSE WORKFORCE' : 'RESUME WORKFORCE'}
            </button>
            <button
              onClick={handleTuneSystem}
              disabled={isSystemTuning}
              className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw size={14} className={isSystemTuning ? 'animate-spin text-brand' : ''} />
              OPTIMIZE ROUTING
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'ACTIVE AGENTS', value: workforceStatus === 'ACTIVE' ? '12 / 15' : '0 / 15', desc: 'Running in Docker sandbox', icon: Users, color: 'text-brand' },
          { title: 'TASKS COMPLETED', value: '4,821', desc: '+15.2% from yesterday', icon: CheckCircle, color: 'text-emerald-400' },
          { title: 'TASK QUEUE', value: workforceStatus === 'ACTIVE' ? '38' : '49', desc: '14 priority executions', icon: ListTodo, color: 'text-blue-400' },
          { title: 'LATENCY', value: workforceStatus === 'ACTIVE' ? '54ms' : 'N/A', desc: 'Global orchestration ping', icon: Activity, color: 'text-purple-400' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#121212] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold tracking-widest text-white/35">{stat.title}</span>
                <Icon size={16} className={stat.color} />
              </div>
              <p className="text-2xl font-black font-mono text-white mt-2">{stat.value}</p>
              <p className="text-[10px] text-white/40 mt-1">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Agent Performance & Latency</h3>
              <p className="text-[10px] text-white/40 mt-0.5">Real-time data stream</p>
            </div>
            <span className="text-[10px] font-mono text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4B4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00D4B4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#00D4B4" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" name="Tasks Run" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity feed logs */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">Command Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-4 max-h-64 pr-2 font-mono text-[10px]">
            {[
              { time: '12:54:12', tag: 'SYSTEM', msg: 'Orchestrator sync status: OK', color: 'text-brand' },
              { time: '12:53:50', tag: 'WORKFLOW', msg: 'SyncCRMContacts completed successfully in 12s', color: 'text-emerald-400' },
              { time: '12:51:02', tag: 'AGENT', msg: 'Agent-Dev-3 requested API access to hubspot.com', color: 'text-blue-400' },
              { time: '12:49:15', tag: 'SECURITY', msg: 'Rate-limited webhook requests from client_sandbox', color: 'text-amber-400' },
              { time: '12:45:00', tag: 'SYSTEM', msg: 'Initialized 4 worker Docker boundaries', color: 'text-purple-400' }
            ].map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start border-l border-white/5 pl-3">
                <span className="text-white/30 shrink-0">{log.time}</span>
                <span className={`${log.color} font-bold shrink-0`}>[{log.tag}]</span>
                <span className="text-white/60 truncate" title={log.msg}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
