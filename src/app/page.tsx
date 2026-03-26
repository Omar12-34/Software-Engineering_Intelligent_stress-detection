"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ContextLog } from '@/components/log/ContextLog';
import { NotificationHistory } from '@/components/history/NotificationHistory';
import { AlertSettings } from '@/components/settings/AlertSettings';
import { useWearable } from '@/hooks/useWearable';
import { Toast } from '@/components/ui/Toast';
import { Activity } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'history' | 'settings'>('dashboard');
  
  const { isConnected, dataHistory, currentMetrics, alerts, newAlert, setNewAlert } = useWearable();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-8 text-center">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Activity className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ZenStudent</h1>
            <p className="text-indigo-100">Intelligent Stress & Anxiety Detection</p>
          </div>
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Student Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ST-12345"
                  defaultValue="ST-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  defaultValue="password"
                />
              </div>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors mt-4"
              >
                Login to Dashboard
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              Prototype Version 0.1.0
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-64 min-h-screen flex flex-col">
        <Header studentName="Alex Johnson" isConnected={isConnected} />
        
        <main className="p-8 flex-1">
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500">Real-time monitoring of your physiological stress markers.</p>
              </div>
              <Dashboard dataHistory={dataHistory} currentMetrics={currentMetrics} />
            </div>
          )}

          {activeTab === 'log' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Context Logging</h2>
              </div>
              <ContextLog />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Alert History</h2>
              </div>
              <NotificationHistory alerts={alerts} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              </div>
              <AlertSettings />
            </div>
          )}
        </main>
      </div>

      {newAlert && (
        <Toast 
          message={newAlert.message} 
          recommendation={newAlert.recommendation} 
          onClose={() => setNewAlert(null)} 
        />
      )}
    </div>
  );
}
