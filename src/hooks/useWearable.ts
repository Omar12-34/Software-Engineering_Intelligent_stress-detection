"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

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
  stressLevel?: string;
  metrics: { hrv: number; eda: number };
};

const MAX_HISTORY = 20;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function useWearable(authToken?: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [dataHistory, setDataHistory] = useState<MetricData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<{ hrv: number; eda: number }>({ hrv: 70, eda: 3 });
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [newAlert, setNewAlert] = useState<AlertEvent | null>(null);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  // Fetch notifications from database on mount
  const fetchNotifications = useCallback(async () => {
    if (!authToken) return;
    
    setIsLoadingAlerts(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const mappedAlerts: AlertEvent[] = data.data.map((n: any) => ({
            id: n._id,
            timestamp: new Date(n.timestamp).toLocaleTimeString(),
            message: n.message,
            recommendation: n.recommendation,
            stressLevel: n.stressLevel,
            metrics: n.metrics || { hrv: 0, eda: 0 }
          }));
          setAlerts(mappedAlerts);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, [authToken]);

  // Load alerts from DB when token is available
  useEffect(() => {
    if (authToken) {
      fetchNotifications();
    }
  }, [authToken, fetchNotifications]);

  // Save notification to database
  const saveNotificationToDB = useCallback(async (alert: AlertEvent, stressLevel: string) => {
    if (!authToken) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: alert.message,
          recommendation: alert.recommendation,
          stressLevel: stressLevel,
          metrics: alert.metrics
        })
      });
    } catch (err) {
      console.error("Failed to save notification:", err);
    }
  }, [authToken]);

  // Connect effect
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsConnected(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Separate effect for stress detection to access fresh state
  const lastAlertTimeRef = useRef(0);
  
  // Data simulation effect
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const isStressSimulation = Math.random() < 0.20;

      let newHrv, newEda;

      if (isStressSimulation) {
        newHrv = 30 + Math.random() * 15; 
        newEda = 8.1 + Math.random() * 1.9;   
      } else {
        newHrv = 55 + Math.random() * 35;
        newEda = 1 + Math.random() * 5;
      }
      
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

      const simulatedHeartRate = Math.round(140 - (newDataPoint.hrv * 0.6));
      
      const currentTime = Date.now();
      if (currentTime - lastAlertTimeRef.current > 5000) {

          console.log("[ML Server Request] Sending:", { heartRate: simulatedHeartRate, eda: newDataPoint.eda });

          fetch('http://127.0.0.1:5001/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              heartRate: simulatedHeartRate,
              eda: newDataPoint.eda
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log(`[ML Server Response] Data:`, data);
            
            if (data && data.stressLevel) {
                if (data.stressLevel === "HIGH" || data.stressLevel === "MILD" || (data.stressLevel === "NORMAL" && Math.random() < 0.30)) {
                   triggerAlert(newDataPoint, data.stressLevel);
                }
            }
          })
          .catch(err => {
              console.error("Error pinging AI ML Server:", err);
          });

          lastAlertTimeRef.current = currentTime;
      }

    }, 2500);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]); 


  const triggerAlert = (metrics: { hrv: number; eda: number }, mlStressLevel: string = "ELEVATED") => {
    const recs = [
      "Take a deep breath and count to 10.",
      "Listen to a calming playlist.",
      "Take a 5-minute walking break.",
      "Drink a glass of water.",
      "Practice 4-7-8 breathing technique."
    ];
    const randomRec = recs[Math.floor(Math.random() * recs.length)];

    const alert: AlertEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message: `AI Detected ${mlStressLevel} stress.`,
      recommendation: randomRec,
      stressLevel: mlStressLevel,
      metrics: { hrv: metrics.hrv, eda: metrics.eda }
    };
    
    setAlerts(prev => [alert, ...prev]);
    setNewAlert(alert);
    
    // Save to database
    saveNotificationToDB(alert, mlStressLevel);
    
    setTimeout(() => setNewAlert(null), 5000);
  };

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!authToken) {
      setAlerts([]);
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/notifications`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setAlerts([]);
      }
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  }, [authToken]);

  return {
    isConnected,
    dataHistory,
    currentMetrics,
    alerts,
    newAlert,
    setNewAlert,
    isLoadingAlerts,
    clearAllNotifications,
    refreshNotifications: fetchNotifications
  };
}
