import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, GitBranch, ListTodo, Terminal, 
  Blocks, LineChart, Bell, User, Settings, Code, HelpCircle, 
  LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  unreadCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, unreadCount, mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [mobileOpen, setMobileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'AI Agents', path: '/agents', icon: Users },
    { name: 'Workflows', path: '/workflows', icon: GitBranch },
    { name: 'Task Queue', path: '/queue', icon: ListTodo },
    { name: 'Execution', path: '/execution', icon: Terminal },
    { name: 'Integrations', path: '/integrations', icon: Blocks },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Developer API', path: '/developer', icon: Code },
    { name: 'Help & Docs', path: '/help', icon: HelpCircle },
  ];

  // Shared inner content
  const SidebarInner = ({ forMobile = false }: { forMobile?: boolean }) => (
    <>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden py-2">
          {(collapsed && !forMobile) ? (
            <img src={logo} alt="TaskBeacons Logo" className="w-8 h-8 object-contain" />
          ) : (
            <img src={logo} alt="TaskBeacons Logo" className="h-7 w-auto" />
          )}
        </div>
        {forMobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/30 hover:text-white/70 hover:bg-white/5 p-1.5 rounded-md transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/30 hover:text-white/70 hover:bg-white/5 p-1 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const showLabel = forMobile || !collapsed;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all group ${
                  isActive 
                    ? 'bg-brand/10 border border-brand/20 text-brand' 
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon size={16} className="shrink-0 group-hover:scale-105 transition-transform" />
              {showLabel && (
                <span className="flex-1 whitespace-nowrap">{item.name}</span>
              )}
              {showLabel && item.badge !== undefined && item.badge > 0 && (
                <span className="bg-brand/20 text-brand text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
              {!showLabel && item.badge !== undefined && item.badge > 0 && (
                <div className="absolute right-3 w-2 h-2 rounded-full bg-brand"></div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-[#0e0e0e]/50">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'}
            alt="User avatar"
            className="w-9 h-9 rounded-full border border-white/10 object-cover shrink-0"
          />
          {(forMobile || !collapsed) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[10px] font-mono text-white/30 truncate leading-none uppercase">{user?.company}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Disconnect Terminal"
            className="text-white/30 hover:text-red-400 p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ─── Desktop / Tablet Sidebar (≥1024px permanent, tablet stays collapsed) ─── */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex bg-[#121212] border-r border-white/5 flex-col h-screen sticky top-0 shrink-0 select-none z-30"
      >
        <SidebarInner />
      </motion.aside>

      {/* ─── Mobile Drawer (<1024px) ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-[260px] h-screen bg-[#121212] border-r border-white/5 flex flex-col select-none z-50 lg:hidden"
          >
            <SidebarInner forMobile />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

