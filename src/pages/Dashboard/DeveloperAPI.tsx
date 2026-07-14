import React, { useState } from 'react';
import { Key, Copy, Check, Eye, EyeOff, Terminal, Plus, ShieldAlert } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DeveloperAPI: React.FC = () => {
  const toast = useToast();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSdk, setSelectedSdk] = useState<'NODE' | 'PYTHON' | 'GO'>('NODE');

  const apiKey = 'tb_live_sec_55102a941bf2840ac2d398ea00fb62d1';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.showToast('API Key copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    toast.showToast('Generating new sandbox token...', 'info');
    setTimeout(() => {
      toast.showToast('New secure API key issued. Vault index updated.', 'success');
    }, 1000);
  };

  const codeSnippets = {
    NODE: `const { TaskBeacons } = require('@taskbeacons/sdk');
const client = new TaskBeacons({ apiKey: 'tb_live_sec_...' });

// Dispatch autonomous research agent
const run = await client.agents.dispatch({
  name: 'MarketIntel-Extractor',
  objective: 'Scrape competitor price indexes'
});
console.log(\`Agent sandbox run started: \${run.id}\`);`,
    PYTHON: `from taskbeacons import TaskBeacons
client = TaskBeacons(api_key='tb_live_sec_...')

# Dispatch autonomous research agent
run = client.agents.dispatch(
    name='MarketIntel-Extractor',
    objective='Scrape competitor price indexes'
)
print(f"Agent sandbox run started: {run.id}")`,
    GO: `package main

import (
	"context"
	"fmt"
	"github.com/taskbeacons/sdk"
)

func main() {
	client := sdk.NewClient("tb_live_sec_...")
	run, _ := client.Agents.Dispatch(context.Background(), sdk.DispatchOpts{
		Name:      "MarketIntel-Extractor",
		Objective: "Scrape competitor price indexes",
	})
	fmt.Printf("Agent sandbox run started: %s\\n", run.ID)
}`
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Developer Gateways
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Integrate agent dispatchers and queue automation directly into your application code.
          </p>
        </div>

        <span className="bg-brand/10 border border-brand/20 text-brand text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Coming Soon
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Token Management Card left */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <Key size={14} className="text-brand" /> Authorization Credentials
            </h3>
            <p className="text-[10px] text-white/40 mt-1">Keep keys secure. Never commit to public codebases.</p>
          </div>

          <div className="bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[11px] relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-white/30 uppercase font-bold">API SECRET KEY</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="text-white/30 hover:text-white"
                  title="Reveal Key"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className="text-white/30 hover:text-white"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={14} className="text-brand" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            
            <p className="text-white/80 select-all overflow-x-auto whitespace-nowrap scrollbar-none font-bold py-1">
              {showKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}
            </p>
          </div>

          <button
            onClick={handleGenerateKey}
            className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono uppercase flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={14} /> GENERATE NEW KEY
          </button>

          <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-2xl text-[10px] text-red-400/80 leading-relaxed font-mono flex gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>Developer Sandbox credentials route requests directly to isolated test Docker boundaries. Rate limits: 60req/min.</span>
          </div>
        </div>

        {/* Code Console right */}
        <div className="lg:col-span-2 bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                  <Terminal size={14} className="text-brand" /> Client SDK Integration
                </h3>
                <p className="text-[10px] text-white/40 mt-1">Pre-built frameworks for rapid automation.</p>
              </div>

              {/* SDK Switcher */}
              <div className="flex border border-white/10 rounded-xl overflow-hidden bg-black/40">
                {(['NODE', 'PYTHON', 'GO'] as const).map(sdk => (
                  <button
                    key={sdk}
                    onClick={() => setSelectedSdk(sdk)}
                    className={`px-3 py-1 text-[10px] font-bold font-mono tracking-wider transition-all ${
                      selectedSdk === sdk ? 'bg-[#00d4b4] text-[#0a0a0a]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {sdk}
                  </button>
                ))}
              </div>
            </div>

            <pre className="p-5 bg-black/85 rounded-2xl border border-white/5 font-mono text-[11px] leading-relaxed text-white/70 overflow-x-auto">
              <code>{codeSnippets[selectedSdk]}</code>
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-white/5 font-mono text-[10px] text-white/35">
            <span>Official Client Modules:</span>
            <div className="flex flex-wrap gap-2">
              {['npm i @taskbeacons/sdk', 'pip install taskbeacons', 'go get github.com/taskbeacons/sdk'].map(command => (
                <span key={command} className="bg-black/40 border border-white/5 px-2.5 py-1 rounded-lg text-white/50 whitespace-nowrap">
                  {command}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
