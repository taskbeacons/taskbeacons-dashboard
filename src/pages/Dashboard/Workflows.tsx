import React, { useState } from 'react';
import { 
  GitBranch, Play, Square, RefreshCw, Clock, Database, Cpu
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  dependencies: string[];
}

const INITIAL_NODES: WorkflowNode[] = [
  { id: 'n-1', name: 'Salesforce Contact Trigger', type: 'trigger', status: 'COMPLETED', dependencies: [] },
  { id: 'n-2', name: 'MarketIntel Agent Enrichment', type: 'action', status: 'RUNNING', dependencies: ['n-1'] },
  { id: 'n-3', name: 'Email Address Verification', type: 'action', status: 'IDLE', dependencies: ['n-2'] },
  { id: 'n-4', name: 'Check Domain Validity', type: 'condition', status: 'IDLE', dependencies: ['n-3'] },
  { id: 'n-5', name: 'Add to Hubspot Campaign', type: 'action', status: 'IDLE', dependencies: ['n-4'] }
];

export const Workflows: React.FC = () => {
  const toast = useToast();
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [pipelineState, setPipelineState] = useState<'IDLE' | 'RUNNING' | 'STOPPED'>('RUNNING');

  const triggerWorkflowRun = () => {
    setPipelineState('RUNNING');
    setNodes(prev => prev.map((n, i) => ({
      ...n,
      status: i === 0 ? 'COMPLETED' : i === 1 ? 'RUNNING' : 'IDLE'
    })));
    toast.showToast('Enrichment pipeline run initiated.', 'success');
  };

  const stopWorkflow = () => {
    setPipelineState('STOPPED');
    setNodes(prev => prev.map(n => ({
      ...n,
      status: n.status === 'RUNNING' ? 'IDLE' : n.status
    })));
    toast.showToast('Enrichment pipeline run terminated.', 'info');
  };

  const restartWorkflow = () => {
    setPipelineState('RUNNING');
    setNodes(prev => prev.map(n => ({
      ...n,
      status: n.id === 'n-1' ? 'RUNNING' : 'IDLE'
    })));
    toast.showToast('Enrichment pipeline restarting from entry trigger...', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Enrichment & Sync Pipeline
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Configure dependency node paths and trigger active orchestrator pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerWorkflowRun}
            disabled={pipelineState === 'RUNNING'}
            className="bg-[#00d4b4] hover:bg-[#00b89e] disabled:opacity-50 text-[#0a0a0a] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-mono"
          >
            <Play size={14} /> RUN
          </button>
          <button
            onClick={stopWorkflow}
            disabled={pipelineState === 'STOPPED' || pipelineState === 'IDLE'}
            className="bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-mono"
          >
            <Square size={14} /> STOP
          </button>
          <button
            onClick={restartWorkflow}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-mono"
          >
            <RefreshCw size={14} /> RESTART
          </button>
        </div>
      </div>

      {/* Dependency Visualizer & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Layout Canvas */}
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden bg-grid-pattern min-h-[400px]">
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest text-brand uppercase border border-brand/20">
            PIPELINE VIEW
          </div>

          <div className="flex flex-col items-center justify-center h-full gap-8 py-10 relative z-10">
            {nodes.map((node, index) => {
              const borderStyles = {
                COMPLETED: 'border-emerald-500 bg-emerald-500/5 text-emerald-400',
                RUNNING: 'border-brand bg-brand/5 text-brand shadow-[0_0_15px_rgba(0,212,180,0.15)] animate-active-pulse',
                FAILED: 'border-red-500 bg-red-500/5 text-red-400',
                IDLE: 'border-white/10 bg-black/50 text-white/30'
              };

              return (
                <React.Fragment key={node.id}>
                  {index > 0 && (
                    <div className="flex flex-col items-center select-none">
                      <div className="h-6 w-0.5 bg-white/5"></div>
                    </div>
                  )}
                  <div className={`w-full max-w-xs border rounded-2xl p-4 flex items-center gap-3 transition-all ${borderStyles[node.status]}`}>
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      {node.type === 'trigger' ? <Database size={16} /> : node.type === 'action' ? <Cpu size={16} /> : <GitBranch size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">{node.type}</span>
                        <span className="text-[8px] font-mono font-bold">{node.status}</span>
                      </div>
                      <h4 className="text-xs font-bold truncate mt-1 text-white uppercase">{node.name}</h4>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Node Side Details & Execution Timeline */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">Pipeline Execution Timeline</h3>
            <div className="space-y-5">
              {nodes.map(node => (
                <div key={node.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      node.status === 'COMPLETED' ? 'border-emerald-500 bg-emerald-500/10' : node.status === 'RUNNING' ? 'border-brand bg-brand/10' : 'border-white/10'
                    }`}>
                      {node.status === 'COMPLETED' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                      {node.status === 'RUNNING' && <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping"></div>}
                    </div>
                    <div className="w-0.5 flex-1 bg-white/5 my-1 min-h-[20px]"></div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">{node.name}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {node.status === 'COMPLETED' ? 'Completed in 1.4s' : node.status === 'RUNNING' ? 'Executing now...' : 'Awaiting dependencies'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 mt-6">
            <div className="flex gap-2 items-start text-white/45 text-[10px] font-mono leading-relaxed">
              <Clock size={14} className="text-brand mt-0.5 shrink-0" />
              <span>Orchestrator sync scheduled for interval 1000ms. Sandboxed in docker network tb_secure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
