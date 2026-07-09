import React, { useState } from 'react';
import { 
  CheckCircle, Trash2, CheckCircle2, ShieldAlert, 
  Info, AlertTriangle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { NotificationItem } from '../../components/Navbar';

interface NotificationsProps {
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  markRead,
  deleteNotification,
  clearAllNotifications
}) => {
  const toast = useToast();
  const [filterType, setFilterType] = useState<'ALL' | 'SYSTEM' | 'SECURITY' | 'TASK'>('ALL');

  const filtered = notifications.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'SYSTEM') return item.type === 'info';
    if (filterType === 'SECURITY') return item.type === 'error' || item.type === 'warning';
    if (filterType === 'TASK') return item.type === 'success';
    return true;
  });

  const handleMarkAllRead = () => {
    clearAllNotifications();
    toast.showToast('All notifications flagged as read.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Notifications Center
          </h2>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Review audit updates, sandbox isolation alerts, and agent action completions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-black/40">
            {['ALL', 'SYSTEM', 'SECURITY', 'TASK'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterType(cat as any)}
                className={`px-3 py-1.5 text-[10px] font-bold font-mono tracking-wider transition-all ${
                  filterType === cat ? 'bg-[#00d4b4] text-[#0a0a0a]' : 'text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-2 bg-brand/10 border border-brand/20 hover:bg-brand/20 text-brand rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-1.5 transition-all"
            >
              <CheckCircle size={12} /> MARK ALL READ
            </button>
          )}
        </div>
      </div>

      {/* Notifications List container */}
      <div className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-xl divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30 font-mono text-xs uppercase tracking-wider">
            No alerts logged for chosen category.
          </div>
        ) : (
          filtered.map(item => {
            const colors = {
              success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
              error: 'border-red-500/20 bg-red-500/5 text-red-400',
              warning: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
              info: 'border-blue-500/20 bg-blue-500/5 text-blue-400'
            };

            const Icon = 
              item.type === 'success' ? CheckCircle2 :
              item.type === 'error' ? ShieldAlert :
              item.type === 'warning' ? AlertTriangle : Info;

            return (
              <div 
                key={item.id} 
                className={`p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${
                  item.read ? 'opacity-50' : 'bg-brand/[0.02]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${colors[item.type]}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-xs font-bold text-white uppercase font-mono">{item.title}</h4>
                      <span className="text-[9px] font-mono text-white/30">{item.time}</span>
                    </div>
                    <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
                  {!item.read && (
                    <button
                      onClick={() => {
                        markRead(item.id);
                        toast.showToast('Alert flagged as read.', 'success');
                      }}
                      className="p-1.5 border border-brand/20 hover:border-brand/40 text-brand bg-brand/5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                    >
                      <CheckCircle size={12} /> Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteNotification(item.id);
                      toast.showToast('Alert dismissed.', 'info');
                    }}
                    className="p-1.5 border border-red-500/20 hover:border-red-500/40 text-red-400 bg-red-500/5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Dismiss
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
