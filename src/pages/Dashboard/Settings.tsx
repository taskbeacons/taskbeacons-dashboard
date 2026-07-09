import React, { useState } from 'react';
import { 
  Palette, Bell, Shield, 
  Code, Eye, ToggleLeft, ToggleRight, Check 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Settings: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'theme' | 'notifications' | 'security' | 'language' | 'developer' | 'appearance'>('theme');

  // Interactive settings state
  const [allowSandboxAlerts, setAllowSandboxAlerts] = useState(true);
  const [allowEmailDigests, setAllowEmailDigests] = useState(false);
  const [requireTwoFactor, setRequireTwoFactor] = useState(true);
  const [debugApiLogs, setDebugApiLogs] = useState(false);
  const [darkGlowEffect, setDarkGlowEffect] = useState(true);

  const handleSaveSetting = (name: string, prevValue: boolean, setValue: (v: boolean) => void) => {
    const nextVal = !prevValue;
    setValue(nextVal);
    toast.showToast(`Setting "${name}" updated to ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'success');
  };

  const tabs = [
    { id: 'theme', label: 'Theme Configuration', icon: Palette },
    { id: 'notifications', label: 'Alert Channels', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'developer', label: 'API Development', icon: Code },
    { id: 'appearance', label: 'Interface Appearance', icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black tracking-wide text-white uppercase">
          Terminal Preferences
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-white/40">
          Configure security requirements, enable developer telemetry, and modify interface layouts.
        </p>
      </div>

      <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar Left */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-4 space-y-1.5 font-mono text-xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl uppercase font-bold tracking-wider text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand/10 text-brand border border-brand/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane Right */}
        <div className="lg:col-span-3 bg-[#121212] border border-white/5 rounded-3xl p-6 sm:p-8 min-h-[300px]">
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">Theme Scheme</h3>
                <p className="text-xs leading-relaxed text-white/40">Select command center primary appearance mode.</p>
              </div>

              <div className="grid max-w-md grid-cols-2 gap-4">
                <button
                  onClick={() => toast.showToast('Dark scheme is locked as primary enterprise theme.', 'info')}
                  className="flex items-center justify-between p-4 text-left border border-brand/30 bg-brand/5 rounded-2xl"
                >
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white uppercase">Dark Theme</h4>
                    <p className="text-[10px] text-white/40 mt-1">Accent: #00D4B4</p>
                  </div>
                  <Check size={16} className="text-brand" />
                </button>

                <button
                  onClick={() => toast.showToast('Light theme unavailable on developer sandbox.', 'error')}
                  className="flex items-center justify-between p-4 text-left border cursor-not-allowed border-white/5 hover:border-white/10 rounded-2xl opacity-40"
                >
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white uppercase">Light Theme</h4>
                    <p className="text-[10px] text-white/45 mt-1">Accent: Standard</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">Alert Rules</h3>
                <p className="text-xs leading-relaxed text-white/40">Toggle channel triggers dispatching alerts to connected nodes.</p>
              </div>

              <div className="max-w-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase">Docker Sandbox Warnings</h4>
                    <p className="text-[10px] text-white/40 mt-1">Trigger notice when docker cpu usage surpasses 80%</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('Docker Sandbox Warnings', allowSandboxAlerts, setAllowSandboxAlerts)}
                    className="transition-colors text-white/60 hover:text-white"
                  >
                    {allowSandboxAlerts ? <ToggleRight size={28} className="text-brand" /> : <ToggleLeft size={28} />}
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase">Email Reports Summary</h4>
                    <p className="text-[10px] text-white/40 mt-1">Dispatch PDF logs snapshot email every 24 hours</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('Email Reports Summary', allowEmailDigests, setAllowEmailDigests)}
                    className="transition-colors text-white/60 hover:text-white"
                  >
                    {allowEmailDigests ? <ToggleRight size={28} className="text-brand" /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">Security Enforcement</h3>
                <p className="text-xs leading-relaxed text-white/40">Set access token requirements and authorization layers.</p>
              </div>

              <div className="max-w-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase">Require Two-Factor (2FA)</h4>
                    <p className="text-[10px] text-white/40 mt-1">Request authentication token code upon login attempt</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('Require Two-Factor (2FA)', requireTwoFactor, setRequireTwoFactor)}
                    className="transition-colors text-white/60 hover:text-white"
                  >
                    {requireTwoFactor ? <ToggleRight size={28} className="text-brand" /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">System Locale</h3>
                <p className="text-xs leading-relaxed text-white/40">Default language translation configurations.</p>
              </div>
              <p className="text-xs leading-relaxed text-white/50">
                Language translations can be adjusted under the <span className="font-bold text-brand">Profile Tab</span> to update session values.
              </p>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">Developer Logs</h3>
                <p className="text-xs leading-relaxed text-white/40">Toggle sandbox debug tracing logs to stdout console.</p>
              </div>

              <div className="max-w-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase">Enable AST Verbose Debugging</h4>
                    <p className="text-[10px] text-white/40 mt-1">Outputs full AST schema changes during code analysis</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('Enable AST Verbose Debugging', debugApiLogs, setDebugApiLogs)}
                    className="transition-colors text-white/60 hover:text-white"
                  >
                    {debugApiLogs ? <ToggleRight size={28} className="text-brand" /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-mono text-sm font-black text-white uppercase">Appearance Tuning</h3>
                <p className="text-xs leading-relaxed text-white/40">Adjust UI micro-interactions and neon glow effects.</p>
              </div>

              <div className="max-w-xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <h4 className="font-bold text-white uppercase">Brand Accent Glow Effect</h4>
                    <p className="text-[10px] text-white/40 mt-1">Render neon shadows around brand cards and modals</p>
                  </div>
                  <button 
                    onClick={() => handleSaveSetting('Brand Accent Glow Effect', darkGlowEffect, setDarkGlowEffect)}
                    className="transition-colors text-white/60 hover:text-white"
                  >
                    {darkGlowEffect ? <ToggleRight size={28} className="text-brand" /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
