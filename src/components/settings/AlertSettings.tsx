import React, { useState } from 'react';
import { Volume2, Share2, Bell, Shield, Moon } from 'lucide-react';

export function AlertSettings() {
  const [settings, setSettings] = useState({
    soundAlerts: true,
    shareData: false,
    desktopNotifications: true,
    highSensitivity: false,
    darkMode: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Alert & System Settings</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {/* Sound Alerts */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Enable Sound Alerts</p>
              <p className="text-sm text-gray-500">Play a sound when a stress spike is detected</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('soundAlerts')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.soundAlerts ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.soundAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Desktop Notifications */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Desktop Notifications</p>
              <p className="text-sm text-gray-500">Show pop-up notifications on your screen</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('desktopNotifications')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.desktopNotifications ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Share Data */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-2.5 rounded-lg text-green-600">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Share with Counselor</p>
              <p className="text-sm text-gray-500">Automatically share weekly reports with school counselor</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('shareData')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.shareData ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.shareData ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

         {/* Sensitivity */}
         <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">High Sensitivity Mode</p>
              <p className="text-sm text-gray-500">Detect smaller fluctuations in stress levels</p>
            </div>
          </div>
          <button 
            onClick={() => toggle('highSensitivity')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.highSensitivity ? 'bg-indigo-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.highSensitivity ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

      </div>
    </div>
  );
}
