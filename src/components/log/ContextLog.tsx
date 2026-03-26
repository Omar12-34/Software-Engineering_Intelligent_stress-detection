import React, { useState } from 'react';
import { Save, Calendar, Clock, MapPin, Activity } from 'lucide-react';

export function ContextLog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Context logged successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Log Context Event</h3>
        <p className="text-sm text-gray-500">Help the system understand your stress triggers by logging your current activity.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Type
          </label>
          <select className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow">
            <option>Studying for Exam</option>
            <option>Public Speaking / Presentation</option>
            <option>Social Interaction</option>
            <option>Physical Exercise</option>
            <option>Relaxing / Leisure</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjective Stress Level (1-10)
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            defaultValue="5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Very Relaxed</span>
            <span>Neutral</span>
            <span>Extremely Stressed</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea 
            rows={4}
            className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="E.g., Math final is coming up, feeling anxious..."
          ></textarea>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
