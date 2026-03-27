import React from 'react';
import { Bell, User } from 'lucide-react';

type HeaderProps = {
  studentName: string;
  isConnected: boolean;
};

export function Header({ studentName, isConnected }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {studentName}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Device Status:</span>
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-amber-500 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Searching...
            </span>
          )}
        </div>

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 text-indigo-700">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
