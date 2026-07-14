import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import type { NotificationItem } from './components/Navbar';
import ScrollToTop from './components/common/ScrollToTop';

// Auth Pages
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';

// Dashboard Pages
import { Overview } from './pages/Dashboard/Overview';
import { Agents } from './pages/Dashboard/Agents';
import { Workflows } from './pages/Dashboard/Workflows';
import { TaskQueue } from './pages/Dashboard/TaskQueue';
import { Execution } from './pages/Dashboard/Execution';
import { Integrations } from './pages/Dashboard/Integrations';
import { Analytics } from './pages/Dashboard/Analytics';
import { Notifications } from './pages/Dashboard/Notifications';
import { Profile } from './pages/Dashboard/Profile';
import { Settings } from './pages/Dashboard/Settings';
import { DeveloperAPI } from './pages/Dashboard/DeveloperAPI';
import { Help } from './pages/Dashboard/Help';

// Initial Mock Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { 
    id: 'notif-1', 
    title: 'SecOps-Sentinel Scan', 
    desc: 'Docker container boundary verified securely. AST package check completed.', 
    time: '10 mins ago', 
    type: 'info', 
    read: false 
  },
  { 
    id: 'notif-2', 
    title: 'SyncCRMContacts Succeeded', 
    desc: 'Auto-sync pipeline synced 120 client contacts to SAP CRM gateway.', 
    time: '1 hr ago', 
    type: 'success', 
    read: false 
  },
  { 
    id: 'notif-3', 
    title: 'Token Usage Cap Alert', 
    desc: 'AutoCoder-Alpha resource utilization reached 85% of container cap.', 
    time: '3 hrs ago', 
    type: 'warning', 
    read: false 
  },
  { 
    id: 'notif-4', 
    title: 'Sandbox Origin Denied', 
    desc: 'Refused database connection attempt from unauthorized IP range.', 
    time: 'Yesterday', 
    type: 'error', 
    read: true 
  }
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Notifications State handlers
  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Determine navbar page title
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Command Center Overview';
      case '/agents': return 'Specialized AI Workers';
      case '/workflows': return 'Orchestration Pipelines';
      case '/queue': return 'Instruction Queue';
      case '/execution': return 'Live System Shell';
      case '/integrations': return 'Ecosystem Tunnels';
      case '/analytics': return 'Telemetry Analytics';
      case '/notifications': return 'Audit Logs Alerts';
      case '/profile': return 'Officer Identity Card';
      case '/settings': return 'Terminal Preferences';
      case '/developer': return 'Developer API SDK';
      case '/help': return 'Operations Guide Desk';
      default: return 'TaskBeacons Terminal';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile backdrop — closes drawer on tap outside */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        unreadCount={unreadCount}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main pane content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title={getPageTitle(location.pathname)} 
          notifications={notifications}
          markRead={markRead}
          deleteNotification={deleteNotification}
          clearAllNotifications={clearAllNotifications}
          onMenuOpen={() => setMobileOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0a0a0a] bg-grid-pattern relative">
          {/* Ambient light glow */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/queue" element={<TaskQueue />} />
              <Route path="/execution" element={<Execution />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={
                <Notifications 
                  notifications={notifications}
                  markRead={markRead}
                  deleteNotification={deleteNotification}
                  clearAllNotifications={clearAllNotifications}
                />
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/developer" element={<DeveloperAPI />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Guarded Dashboard Layout Routing */}
            <Route path="/*" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

