import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, AlertCircle } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ToastProps = {
  message: string;
  recommendation?: string;
  onClose: () => void;
};

export function Toast({ message, recommendation, onClose }: ToastProps) {
  return (
    <div className={cn(
      "fixed top-5 right-5 z-50 w-80 bg-white border-l-4 border-red-500 shadow-lg rounded-md overflow-hidden animate-in slide-in-from-right duration-300",
      "dark:bg-slate-800 dark:text-white"
    )}>
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
          {recommendation && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{recommendation}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
