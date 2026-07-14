import React, { useState } from 'react';
import { 
  Play, Pause, Trash2, Plus, X, Search, 
  Cpu, FileText, AlertTriangle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'RUNNING' | 'PAUSED' | 'IDLE';
  tasksCompleted: number;
  successRate: number;
  cpu: number;
  memory: string;
  logs: string[];
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt-1',
    name: 'AutoCoder-Alpha',
    role: 'Software Development & PR Reviewer',
    status: 'RUNNING',
    tasksCompleted: 341,
    successRate: 98.2,
    cpu: 24,
    memory: '1.2 GB',
    logs: [
      'Initialized workspace clone...',
      'Running eslint checker...',
      'Detected 4 imports unused. Auto-refactoring...',
      'Created PR branch feature/crm-oauth'
    ]
  },
  {
    id: 'agt-2',
    name: 'MarketIntel-Extractor',
    role: 'Web Scraping & Competitor Intelligence',
    status: 'PAUSED',
    tasksCompleted: 1024,
    successRate: 99.4,
    cpu: 0,
    memory: '256 MB',
    logs: [
      'Task suspended by orchestrator signal.',
      'Saved checkpoint index: 9410'
    ]
  },
  {
    id: 'agt-3',
    name: 'SecOps-Sentinel',
    role: 'Vulnerability Audit & Security Guard',
    status: 'RUNNING',
    tasksCompleted: 142,
    successRate: 100,
    cpu: 8,
    memory: '512 MB',
    logs: [
      'Scanning Docker container overlays...',
      'Verified package-lock.json signature',
      'No critical dependencies flagged.'
    ]
  },
  {
    id: 'agt-4',
    name: 'DocuSync-Validator',
    role: 'Schema Validation & PDF Processing',
    status: 'IDLE',
    tasksCompleted: 890,
    successRate: 97.5,
    cpu: 2,
    memory: '190 MB',
    logs: [
      'Listening for task objective...'
    ]
  }
];

export const Agents: React.FC = () => {
  const toast = useToast();
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // New Agent Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Software Development & PR Reviewer');

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
        toast.showToast(`${a.name} is now ${nextStatus.toLowerCase()}`, 'info');
        return {
          ...a,
          status: nextStatus,
          cpu: nextStatus === 'RUNNING' ? 12 : 0
        };
      }
      return a;
    }));
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.showToast('Please specify agent identifier name.', 'error');
      return;
    }

    const newAgent: Agent = {
      id: `agt-${Date.now()}`,
      name: newName,
      role: newRole,
      status: 'IDLE',
      tasksCompleted: 0,
      successRate: 100,
      cpu: 0,
      memory: '128 MB',
      logs: ['Agent initialized. Awaiting orchestration tasks.']
    };

    setAgents(prev => [newAgent, ...prev]);
    toast.showToast(`Agent "${newName}" successfully provisioned.`, 'success');
    setNewName('');
    setShowCreateModal(false);
  };

  const handleDeleteAgent = (id: string) => {
    const target = agents.find(a => a.id === id);
    setAgents(prev => prev.filter(a => a.id !== id));
    toast.showToast(`Agent "${target?.name}" removed from Docker context.`, 'success');
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Managed AI Agents
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Provision, monitor sandbox boundaries, and pause individual autonomous workers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search agent logs, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-white/5 pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/40 font-mono"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#00d4b4] hover:bg-[#00b89e] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all shrink-0"
          >
            <Plus size={14} /> CREATE AGENT
          </button>
        </div>

      </div>

      {/* Agents Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAgents.map(agent => (
          <div 
            key={agent.id} 
            className="bg-[#121212] border border-white/5 hover:border-brand/20 transition-all rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase">{agent.name}</h3>
                    <p className="text-[10px] text-white/45 mt-0.5">{agent.role}</p>
                  </div>
                </div>
                
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  agent.status === 'RUNNING' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : agent.status === 'PAUSED'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}>
                  {agent.status}
                </span>
              </div>

              {/* Progress and Metrics */}
              <div className="grid grid-cols-3 gap-2 my-6 pt-4 border-t border-white/5 text-center font-mono">
                <div>
                  <span className="text-[8px] text-white/30 uppercase block">Tasks Run</span>
                  <span className="text-sm font-bold text-white block mt-0.5">{agent.tasksCompleted}</span>
                </div>
                <div>
                  <span className="text-[8px] text-white/30 uppercase block">Accuracy</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-0.5">{agent.successRate}%</span>
                </div>
                <div>
                  <span className="text-[8px] text-white/30 uppercase block">CPU / RAM</span>
                  <span className="text-sm font-bold text-brand block mt-0.5">{agent.cpu}% / {agent.memory}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedAgent(agent)}
                className="text-[10px] font-mono text-white/45 hover:text-white flex items-center gap-1.5 uppercase font-bold"
              >
                <FileText size={12} /> View Logs
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAgentStatus(agent.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    agent.status === 'RUNNING'
                      ? 'border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-500/5'
                      : 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/5'
                  }`}
                  title={agent.status === 'RUNNING' ? 'Pause Execution' : 'Resume Execution'}
                >
                  {agent.status === 'RUNNING' ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(agent.id)}
                  className="p-2 border border-red-500/20 hover:border-red-500/40 text-red-400 bg-red-500/5 rounded-xl transition-colors"
                  title="Remove Agent Container"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Modal Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
                  {selectedAgent.name} System Logs
                </h3>
                <p className="text-[10px] text-white/45 mt-0.5">{selectedAgent.role}</p>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 font-mono text-[11px] space-y-2.5 max-h-80 overflow-y-auto bg-black/50 text-white/70">
              {selectedAgent.logs.map((log, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <span className="text-white/20 select-none">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl border border-white/10"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateAgent}
            className="bg-[#121212] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
                Provision New AI Worker
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Agent ID Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SalesScout-Dev"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Specialized Action Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand/50 font-mono"
                >
                  <option value="Software Development & PR Reviewer">Software Development & PR Reviewer</option>
                  <option value="Web Scraping & Competitor Intelligence">Web Scraping & Competitor Intelligence</option>
                  <option value="Vulnerability Audit & Security Guard">Vulnerability Audit & Security Guard</option>
                  <option value="Schema Validation & PDF Processing">Schema Validation & PDF Processing</option>
                  <option value="Data Pipeline Synchronization">Data Pipeline Synchronization</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent hover:bg-white/5 text-white/60 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#00d4b4] hover:bg-[#00b89e] text-[#0a0a0a] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                DEPLOY CONTAINER
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex gap-3 items-center text-red-400">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-black uppercase tracking-wider font-mono">
                Destroy Agent Container?
              </h3>
            </div>
            <div className="p-6 text-xs text-white/50 leading-relaxed font-mono">
              Are you sure you want to shut down and completely delete this agent? Active cache states and pending logs will be permanently deleted from the sandboxed environment.
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-transparent hover:bg-white/5 text-white/60 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAgent(showDeleteConfirm)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                DESTROY CONTAINER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
