
import { TimerMode } from './types';

export const TIMER_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const STORAGE_KEYS = {
  NOTES: 'zenfocus_notes',
  STATS: 'zenfocus_stats',
  STREAK: 'zenfocus_streak',
  LAST_ACTIVE_DATE: 'zenfocus_last_date',
};

export const MODE_LABELS: Record<TimerMode, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};
