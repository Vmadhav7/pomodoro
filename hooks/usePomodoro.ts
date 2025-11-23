import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerState } from '../types';
import { TIMER_DURATIONS } from '../constants';
import { updateStats, loadStats } from '../utils/storage';
import { playNotificationSound } from '../utils/sound';

export const usePomodoro = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS['work']);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState(loadStats());
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsActive(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  }, [mode]);

  const completeSession = useCallback(() => {
    playNotificationSound();
    setIsActive(false);

    if (mode === 'work') {
      const newStats = updateStats(TIMER_DURATIONS['work'] / 60, 1);
      setStats(newStats);
      // Auto-switch logic could go here, but minimalist usually implies manual next step or auto-break
      // Let's auto-switch to short break if cycles % 4 !== 0, else long break
      // Need to track consecutive cycles to be smart, but for MVP simple switch is ok.
      // We'll just stop and let user decide or default to short break.
      setMode('shortBreak');
      setTimeLeft(TIMER_DURATIONS['shortBreak']);
    } else {
      // Break over, back to work
      setMode('work');
      setTimeLeft(TIMER_DURATIONS['work']);
    }
  }, [mode]);

  useEffect(() => {
    if (isActive) {
      lastTickRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickRef.current) / 1000);
        
        if (delta >= 1) {
          setTimeLeft((prev) => {
            const next = prev - delta;
            if (next <= 0) {
              completeSession();
              return 0;
            }
            return next;
          });
          lastTickRef.current = now;
        }
      }, 100); // Check frequently for smoothness, but deduct based on delta
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, completeSession]);

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100;

  return {
    mode,
    timeLeft,
    isActive,
    stats,
    progress,
    switchMode,
    toggleTimer,
    resetTimer
  };
};