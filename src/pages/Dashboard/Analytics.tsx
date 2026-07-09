import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const analyticsData24h = [
  { name: '08:00', run: 12, fail: 0, cost: 0.12 },
  { name: '10:00', run: 25, fail: 1, cost: 0.26 },
  { name: '12:00', run: 45, fail: 0, cost: 0.45 },
  { name: '14:00', run: 30, fail: 2, cost: 0.34 },
  { name: '16:00', run: 55, fail: 0, cost: 0.55 },
  { name: '18:00', run: 40, fail: 1, cost: 0.42 },
  { name: '20:00', run: 65, fail: 0, cost: 0.65 },
];

const analyticsData7d = [
  { name: 'Mon', run: 210, fail: 4, cost: 2.10 },
  { name: 'Tue', run: 340, fail: 5, cost: 3.45 },
  { name: 'Wed', run: 405, fail: 8, cost: 4.10 },
  { name: 'Thu', run: 290, fail: 3, cost: 2.95 },
  { name: 'Fri', run: 480, fail: 10, cost: 4.88 },
  { name: 'Sat', run: 150, fail: 1, cost: 1.52 },
  { name: 'Sun', run: 190, fail: 2, cost: 1.94 },
];

export const Analytics: React.FC = () => {
  const toast = useToast();
  const [timeRange, setTimeRange] = useState<'24H' | '7D'>('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeData = timeRange === '24H' ? analyticsData24h : analyticsData7d;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.showToast('Analytics cache refreshed successfully.', 'success');
    }, 1000);
  };

  const handleExport = (type: 'CSV' | 'PDF') => {
    toast.showToast(`Compiling and downloading ${timeRange} analytics log as ${type}...`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Operation Analytics
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Detailed performance logs, task success rates, and token execution costs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-black/40">
            <button
              onClick={() => setTimeRange('24H')}
              className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider transition-all ${
                timeRange === '24H' ? 'bg-[#00d4b4] text-[#0a0a0a]' : 'text-white/60 hover:text-white'
              }`}
            >
              24H
            </button>
            <button
              onClick={() => setTimeRange('7D')}
              className={`px-3 py-1.5 text-xs font-bold font-mono tracking-wider transition-all ${
                timeRange === '7D' ? 'bg-[#00d4b4] text-[#0a0a0a]' : 'text-white/60 hover:text-white'
              }`}
            >
              7D
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 border border-white/10 bg-[#121212] hover:bg-white/5 rounded-xl transition-all"
            title="Force Cache Refresh"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-brand' : ''} />
          </button>

          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-all"
          >
            <Download size={12} /> CSV
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-all"
          >
            <Download size={12} /> PDF
          </button>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput Bar Chart */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-6">Pipeline Runs vs Fails</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData}>
                <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace' }} />
                <Bar dataKey="run" fill="#00D4B4" radius={[4, 4, 0, 0]} name="Successful Runs" />
                <Bar dataKey="fail" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failures" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Optimization Area Chart */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-6">Orchestration Tokens Cost ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeData}>
                <CartesianGrid stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#161616', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="cost" stroke="#c084fc" strokeWidth={2} name="Cost ($)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
