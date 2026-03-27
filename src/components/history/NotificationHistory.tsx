import React from 'react';
import { AlertEvent } from '@/hooks/useWearable';
import { AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';

type NotificationHistoryProps = {
  alerts: AlertEvent[];
  onClearAll?: () => void;
};

export function NotificationHistory({ alerts, onClearAll }: NotificationHistoryProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
        <p className="text-gray-500 mt-1">No stress events detected yet. Keep up the good work!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts & Recommendations</h3>
          <p className="text-sm text-gray-500">{alerts.length} notification{alerts.length !== 1 ? 's' : ''}</p>
        </div>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                alert.stressLevel === 'HIGH' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-amber-100 text-amber-600'
              }`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{alert.message}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.timestamp}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Detected at: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs">HRV: {alert.metrics.hrv}ms</span> <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs ml-2">EDA: {alert.metrics.eda}µS</span>
                </p>
                <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3">
                  <p className="text-sm font-medium text-indigo-900 mb-1">Recommendation:</p>
                  <p className="text-sm text-indigo-700">{alert.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
