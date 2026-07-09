import React, { useState } from 'react';
import { 
  Search, ArrowUpDown, Trash2, ArrowUpCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface QueueTask {
  id: string;
  objective: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  submittedBy: string;
  status: 'QUEUED' | 'ACQUIRED' | 'SUSPENDED';
  timestamp: string;
}

const INITIAL_TASKS: QueueTask[] = [
  { id: 'tsk-941', objective: 'Sync HubSpot contacts and run enrichment sequence', priority: 'HIGH', submittedBy: 'API Secret Token', status: 'QUEUED', timestamp: '12:54:01' },
  { id: 'tsk-940', objective: 'Scan local docker overlays for CVEs', priority: 'CRITICAL', submittedBy: 'System Watchdog', status: 'ACQUIRED', timestamp: '12:53:45' },
  { id: 'tsk-939', objective: 'Audit active Salesforce connection token refresh signatures', priority: 'MEDIUM', submittedBy: 'Officer Portal', status: 'QUEUED', timestamp: '12:52:12' },
  { id: 'tsk-938', objective: 'Index competitor pricing indexes for web app builders', priority: 'LOW', submittedBy: 'Cron Scheduler', status: 'SUSPENDED', timestamp: '12:50:00' },
  { id: 'tsk-937', objective: 'Format financial PDF tables into JSON structured logs', priority: 'MEDIUM', submittedBy: 'API Secret Token', status: 'QUEUED', timestamp: '12:48:33' }
];

export const TaskQueue: React.FC = () => {
  const toast = useToast();
  const [tasks, setTasks] = useState<QueueTask[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleUpgradePriority = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let nextPriority = t.priority;
        if (t.priority === 'LOW') nextPriority = 'MEDIUM';
        else if (t.priority === 'MEDIUM') nextPriority = 'HIGH';
        else if (t.priority === 'HIGH') nextPriority = 'CRITICAL';
        
        toast.showToast(`Task ${t.id} upgraded to ${nextPriority} priority.`, 'success');
        return { ...t, priority: nextPriority };
      }
      return t;
    }));
  };

  const handleTerminateTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.showToast(`Task ${id} terminated and dropped from queue.`, 'info');
  };

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filter & Search
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.objective.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Sort by timestamp
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.timestamp.localeCompare(b.timestamp);
    } else {
      return b.timestamp.localeCompare(a.timestamp);
    }
  });

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Autonomous Task Queue
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Manage incoming instructions waiting to be assigned to sandbox AI agents.
          </p>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search instructions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121212] border border-white/5 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/40 font-mono"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-[#121212] border border-white/5 rounded-xl px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-brand/40 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button
            onClick={toggleSort}
            className="bg-[#121212] border border-white/5 hover:border-white/10 p-2 rounded-xl text-white/60 hover:text-white transition-all"
            title="Sort by Timestamp"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* Tasks Grid Board */}
      <div className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-white/30">
                <th className="p-4 uppercase tracking-wider font-bold">Task ID</th>
                <th className="p-4 uppercase tracking-wider font-bold">Execution Objective</th>
                <th className="p-4 uppercase tracking-wider font-bold">Priority</th>
                <th className="p-4 uppercase tracking-wider font-bold">Origin</th>
                <th className="p-4 uppercase tracking-wider font-bold">Status</th>
                <th className="p-4 uppercase tracking-wider font-bold">Submitted</th>
                <th className="p-4 uppercase tracking-wider font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/30">
                    No matching pending tasks in execution queue.
                  </td>
                </tr>
              ) : (
                sortedTasks.map(task => {
                  const priorityColors = {
                    CRITICAL: 'text-red-400 bg-red-400/10 border-red-500/20',
                    HIGH: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
                    MEDIUM: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
                    LOW: 'text-white/40 bg-white/5 border-white/10'
                  };

                  return (
                    <tr key={task.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-bold text-white shrink-0">{task.id}</td>
                      <td className="p-4 font-sans text-xs text-white/80 max-w-sm truncate" title={task.objective}>
                        {task.objective}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 text-white/50">{task.submittedBy}</td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 ${
                          task.status === 'ACQUIRED' ? 'text-brand' : task.status === 'QUEUED' ? 'text-blue-400' : 'text-white/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            task.status === 'ACQUIRED' ? 'bg-brand animate-ping' : task.status === 'QUEUED' ? 'bg-blue-400' : 'bg-white/30'
                          }`}></span>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4 text-white/40">{task.timestamp}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {task.priority !== 'CRITICAL' && (
                            <button
                              onClick={() => handleUpgradePriority(task.id)}
                              className="p-1.5 border border-brand/20 hover:border-brand/40 text-brand bg-brand/5 rounded-lg transition-colors"
                              title="Promote Priority Level"
                            >
                              <ArrowUpCircle size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => handleTerminateTask(task.id)}
                            className="p-1.5 border border-red-500/20 hover:border-red-500/40 text-red-400 bg-red-500/5 rounded-lg transition-colors"
                            title="Abort Objective"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
