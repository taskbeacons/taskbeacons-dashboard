import React, { useState } from 'react';
import { 
  Blocks, Link2, Link2Off, ShieldCheck, Database, 
  Mail, MessageSquare, X 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface Integration {
  id: string;
  name: string;
  desc: string;
  category: 'CRM' | 'COMMUNICATION' | 'DATABASE' | 'UTILITY';
  status: 'CONNECTED' | 'DISCONNECTED';
  icon: any;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'int-1', name: 'Salesforce CRM Gateway', desc: 'Sync pipelines, customer profiles, and trigger automated sales workflows.', category: 'CRM', status: 'CONNECTED', icon: Database },
  { id: 'int-2', name: 'Slack ChatOps Sync', desc: 'Stream system execution logs, active agent messages, and security notifications.', category: 'COMMUNICATION', status: 'CONNECTED', icon: MessageSquare },
  { id: 'int-3', name: 'HubSpot Marketing Hub', desc: 'Provision marketing pipelines, validate email domains, and sync contacts.', category: 'CRM', status: 'DISCONNECTED', icon: Blocks },
  { id: 'int-4', name: 'PostgreSQL DB Gateway', desc: 'Secure query gateway with AES-256 rest encryption tunnels.', category: 'DATABASE', status: 'DISCONNECTED', icon: Database },
  { id: 'int-5', name: 'Secure SMTP Dispatcher', desc: 'Auto-dispatch validation emails and report summaries to authorized clients.', category: 'UTILITY', status: 'CONNECTED', icon: Mail }
];

export const Integrations: React.FC = () => {
  const toast = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [secretKey, setSecretKey] = useState('');
  const [clientId, setClientId] = useState('');

  const handleToggleConnection = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return;

    if (integration.status === 'CONNECTED') {
      setIntegrations(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'DISCONNECTED' } : item
      ));
      toast.showToast(`${integration.name} disconnected. Keys purged from config vault.`, 'info');
    } else {
      setSelectedIntegration(integration);
      setSecretKey('');
      setClientId('');
    }
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim() || !secretKey.trim()) {
      toast.showToast('Client ID and Token key are required.', 'error');
      return;
    }

    if (selectedIntegration) {
      const targetId = selectedIntegration.id;
      setIntegrations(prev => prev.map(item => 
        item.id === targetId ? { ...item, status: 'CONNECTED' } : item
      ));
      toast.showToast(`${selectedIntegration.name} successfully authenticated and connected!`, 'success');
      setSelectedIntegration(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">
          Connected Ecosystem
        </h2>
        <p className="text-xs text-white/40 mt-1 leading-relaxed">
          Enable or disable gateways connecting TaskBeacons agents to external enterprise databases, internal CRMs, and messaging frameworks.
        </p>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => {
          const Icon = integration.icon;
          return (
            <div 
              key={integration.id} 
              className="bg-[#121212] border border-white/5 hover:border-brand/20 transition-all rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <Icon size={20} />
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    integration.status === 'CONNECTED' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {integration.status}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white uppercase mt-5">{integration.name}</h3>
                <span className="text-[9px] font-mono font-bold text-white/30 uppercase mt-1 block">{integration.category}</span>
                <p className="text-xs text-white/50 leading-relaxed mt-3">{integration.desc}</p>
              </div>

              <div className="flex justify-between items-center pt-5 mt-6 border-t border-white/5">
                <span className="text-[10px] font-mono text-white/35 uppercase flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-brand" /> AES-256 VAULT
                </span>
                
                <button
                  onClick={() => handleToggleConnection(integration.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 border ${
                    integration.status === 'CONNECTED'
                      ? 'border-red-500/25 hover:border-red-500/40 text-red-400 bg-red-500/5'
                      : 'border-brand/25 hover:border-brand/40 text-brand bg-brand/5'
                  }`}
                >
                  {integration.status === 'CONNECTED' ? (
                    <>
                      <Link2Off size={12} /> Disconnect
                    </>
                  ) : (
                    <>
                      <Link2 size={12} /> Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Gateway Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleConnectSubmit}
            className="bg-[#121212] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider font-mono">
                  Configure Gateway
                </h3>
                <p className="text-[10px] text-white/45 mt-0.5">{selectedIntegration.name}</p>
              </div>
              <button type="button" onClick={() => setSelectedIntegration(null)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Client Identifier Key (Client ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. sfdc_client_live_9410"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  API Key Signature (Secret Key)
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedIntegration(null)}
                className="bg-transparent hover:bg-white/5 text-white/60 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#00d4b4] hover:bg-[#00b89e] text-[#0a0a0a] font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl"
              >
                AUTHORIZE LINK
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
