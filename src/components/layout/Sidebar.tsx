import React from 'react';
import { LayoutDashboard, History, FileText, Settings, Activity } from 'lucide-react';
import { clsx } from 'clsx';

type Tab = 'dashboard' | 'log' | 'history' | 'settings';

type SidebarProps = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'log', label: 'Log Context Event', icon: FileText },
    { id: 'history', label: 'Notification History', icon: History },
    { id: 'settings', label: 'Alert Settings', icon: Settings },
  ] as const;

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <Activity className="text-teal-400 h-8 w-8" />
        <h1 className="text-xl font-bold tracking-tight">ZenStudent</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-teal-600 text-white shadow-md" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Online
          </div>
        </div>
      </div>
    </div>
  );
}
