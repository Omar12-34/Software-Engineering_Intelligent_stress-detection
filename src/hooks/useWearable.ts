"use client";

import { useState, useEffect, useRef } from 'react';

export type MetricData = {
  timestamp: string;
  hrv: number;
  eda: number;
};

export type AlertEvent = {
  id: string;
  timestamp: string;
  message: string;
  recommendation: string;
  metrics: { hrv: number; eda: number };
};

const MAX_HISTORY = 20;

export function useWearable() {
  const [isConnected, setIsConnected] = useState(false);
  const [dataHistory, setDataHistory] = useState<MetricData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<{ hrv: number; eda: number }>({ hrv: 70, eda: 3 });
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [newAlert, setNewAlert] = useState<AlertEvent | null>(null);

  // Connect effect
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Separate effect for stress detection to access fresh state
  const lastAlertTimeRef = useRef(0);
  
  // Data simulation effect
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const now = new Date();
      // Format time as HH:MM:SS
      const timeString = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Simulate slight random fluctuations
      // HRV: 40-100. EDA: 1-10.
      
      // Randomly decide if we are in a "stress event" mode (20% chance for demo purposes)
      const isStressSimulation = Math.random() < 0.20;

      let newHrv, newEda;

      if (isStressSimulation) {
        // Stress Spike! Low HRV (30-45), High EDA (8-10)
        newHrv = 30 + Math.random() * 15; 
        newEda = 8.1 + Math.random() * 1.9;   
      } else {
        // Normal
        newHrv = 55 + Math.random() * 35; // 55-90
        newEda = 1 + Math.random() * 5;   // 1-6
      }
      
      // Clamp values
      newHrv = Math.max(30, Math.min(100, newHrv));
      newEda = Math.max(1, Math.min(12, newEda));

      const newDataPoint = {
        timestamp: timeString,
        hrv: Math.round(newHrv),
        eda: Number(newEda.toFixed(1)),
      };

      setCurrentMetrics({ hrv: newDataPoint.hrv, eda: newDataPoint.eda });

      setDataHistory(prev => {
        const newHistory = [...prev, newDataPoint];
        if (newHistory.length > MAX_HISTORY) return newHistory.slice(newHistory.length - MAX_HISTORY);
        return newHistory;
      });

      // Stress Detection Logic
      // Condition: EDA > 8 AND HRV < 45
      if (newDataPoint.eda > 8 && newDataPoint.hrv < 45) {
        const currentTime = Date.now();
        // Avoid alert spamming (limit to one every 10 seconds for demo)
        if (currentTime - lastAlertTimeRef.current > 10000) {
            triggerAlert(newDataPoint);
            lastAlertTimeRef.current = currentTime;
        }
      }

    }, 2500);

    return () => clearInterval(interval);
  }, [isConnected]); 


  const triggerAlert = (metrics: { hrv: number; eda: number }) => {
    const recs = [
      "Take a deep breath and count to 10.",
      "Listen to a calming playlist.",
      "Take a 5-minute walking break.",
      "Drink a glass of water.",
      "Practice 4-7-8 breathing technique."
    ];
    const randomRec = recs[Math.floor(Math.random() * recs.length)];

    const alert: AlertEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message: "Elevated stress detected.",
      recommendation: randomRec,
      metrics: { hrv: metrics.hrv, eda: metrics.eda }
    };
    
    setAlerts(prev => [alert, ...prev]);
    setNewAlert(alert);
    
    // Auto-clear the "new" flag after 5s so toasts don't stick forever
    setTimeout(() => setNewAlert(null), 5000);
  };

  return {
    isConnected,
    dataHistory,
    currentMetrics,
    alerts,
    newAlert,
    setNewAlert
  };
}
