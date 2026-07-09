import React, { useState } from 'react';
import { 
  Search, Bell, Settings, CheckCircle, 
  Trash2, X, RefreshCw, Radio
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

interface NavbarProps {
  title: string;
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  title, 
  notifications, 
  markRead, 
  deleteNotification,
  clearAllNotifications 
}) => {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="h-16 bg-[#121212] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-black uppercase tracking-wider text-white font-mono">{title}</h1>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
          <Radio size={10} className="animate-pulse" />
          SYSTEM STABLE
        </div>
      </div>

      {/* Global Controls */}
      <div className="flex items-center gap-4">
        {/* Mock Search Bar */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search commands, agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-60 bg-black/50 border border-white/5 pl-9 pr-4 py-1.5 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/40 focus:w-72 transition-all font-mono"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Refresh System Trigger */}
        <button
          onClick={handleRefresh}
          className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          title="Refresh Operations Telemetry"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-brand' : ''} />
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-colors relative"
            title="Notification Feed"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand"></span>
            )}
          </button>

          <AnimatePresence>
            {showBellDropdown && (
              <>
                {/* Backdrop overlay to close dropdown */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowBellDropdown(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-[#121212] border border-white/5 rounded-2xl shadow-2xl overflow-hidden z-40"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                      System Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] font-mono text-brand hover:underline font-bold uppercase"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-white/30 text-xs">
                        No critical alerts pending.
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div 
                          key={item.id} 
                          className={`p-3 text-xs transition-colors hover:bg-white/5 ${item.read ? 'opacity-60' : 'bg-brand/5 border-l-2 border-brand'}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-bold text-white leading-tight">{item.title}</span>
                            <span className="text-[9px] text-white/30 whitespace-nowrap">{item.time}</span>
                          </div>
                          <p className="text-white/50 mt-1 leading-snug">{item.desc}</p>
                          <div className="flex gap-2.5 mt-2 justify-end">
                            {!item.read && (
                              <button 
                                onClick={() => markRead(item.id)}
                                className="text-[10px] font-mono text-brand hover:underline flex items-center gap-1 font-bold"
                              >
                                <CheckCircle size={10} /> Mark Read
                              </button>
                            )}
                            <button 
                              onClick={() => deleteNotification(item.id)}
                              className="text-[10px] font-mono text-red-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              <Trash2 size={10} /> Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-white/5 text-center bg-black/30">
                    <Link
                      to="/notifications"
                      onClick={() => setShowBellDropdown(false)}
                      className="text-[10px] font-mono text-white/45 hover:text-white uppercase font-bold"
                    >
                      View All Logs
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Shortcut Settings */}
        <Link
          to="/settings"
          className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          title="Terminal Settings"
        >
          <Settings size={16} />
        </Link>
      </div>
    </header>
  );
};
