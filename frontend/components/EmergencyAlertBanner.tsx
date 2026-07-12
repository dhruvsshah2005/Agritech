'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, Bug, Cloud, Droplets, Volume2, X } from 'lucide-react';
import { socketManager } from '@/lib/socket';

interface EmergencyAlert {
  id: string | number;
  district: string;
  type: 'weather' | 'pest' | 'crop' | 'market';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  actionRequired?: string;
}

export default function EmergencyAlertBanner() {
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null);

  useEffect(() => {
    const socket = socketManager.getSocket();

    const handleNewAlert = (alert: EmergencyAlert) => {
      console.log('🚨 Live Emergency Alert Received via Socket.IO:', alert);
      setCurrentAlert(alert);

      // Speak alert out loud if speech synthesis is available
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          `Attention Farmer: Emergency Alert in ${alert.district}. ${alert.title}. ${alert.description}`
        );
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    };

    socket.on('emergency_alert', handleNewAlert);
    socket.on('new_alert_broadcast', handleNewAlert);

    return () => {
      socket.off('emergency_alert', handleNewAlert);
      socket.off('new_alert_broadcast', handleNewAlert);
    };
  }, []);

  if (!currentAlert) return null;

  const getIcon = () => {
    switch (currentAlert.type) {
      case 'pest': return Bug;
      case 'weather': return Cloud;
      default: return AlertCircle;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl animate-fade-in-up">
      <div
        className={`relative overflow-hidden rounded-2xl p-4 shadow-2xl backdrop-blur-xl border ${
          currentAlert.severity === 'high'
            ? 'bg-red-500/95 text-white border-red-400 shadow-red-500/20'
            : 'bg-amber-500/95 text-white border-amber-400 shadow-amber-500/20'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 shrink-0">
              <Icon className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  LIVE SOCKET ALERT · {currentAlert.district}
                </span>
              </div>
              <h4 className="font-bold text-base leading-snug">{currentAlert.title}</h4>
              <p className="text-xs text-white/90 leading-relaxed">{currentAlert.description}</p>
              {currentAlert.actionRequired && (
                <p className="text-xs font-semibold text-white/95 mt-1 bg-black/10 px-2.5 py-1 rounded-lg inline-block">
                  ⚡ Action: {currentAlert.actionRequired}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentAlert(null)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
