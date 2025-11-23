
import { NoteData, DailyStats } from '../types';
import { STORAGE_KEYS } from '../constants';

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayDateString = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

export const loadNotes = (): NoteData => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
  const parsed = stored ? JSON.parse(stored) : {};
  return {
    work: parsed.work || '',
    break: parsed.break || '',
    tasks: parsed.tasks || []
  };
};

export const saveNotes = (notes: NoteData) => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

interface StreakData {
  count: number;
  lastDate: string | null;
}

const loadStreakData = (): StreakData => {
  const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
  return stored ? JSON.parse(stored) : { count: 0, lastDate: null };
};

export const loadStats = (): DailyStats => {
  const today = getTodayDateString();
  const storedStats = localStorage.getItem(STORAGE_KEYS.STATS);
  const lastActiveDate = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
  
  // Calculate current display streak
  // If the user missed yesterday, the streak is effectively 0 (broken), 
  // unless they completed one today already.
  const streakData = loadStreakData();
  const yesterday = getYesterdayDateString();
  
  let currentDisplayStreak = streakData.count;
  
  // If the last completed session wasn't today AND wasn't yesterday, the streak is broken.
  if (streakData.lastDate && streakData.lastDate !== today && streakData.lastDate !== yesterday) {
    currentDisplayStreak = 0;
  }

  // Handle daily stat reset
  if (lastActiveDate !== today || !storedStats) {
    const newStats: DailyStats = { 
      date: today, 
      cycles: 0, 
      workMinutes: 0,
      streak: currentDisplayStreak
    };
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
    return newStats;
  }

  const parsedStats = JSON.parse(storedStats);
  return { ...parsedStats, streak: currentDisplayStreak };
};

export const updateStats = (minutesToAdd: number, cyclesToAdd: number): DailyStats => {
  const currentStats = loadStats(); // This loads current day's stats
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  
  // Update Streak Logic
  let streakData = loadStreakData();
  
  if (streakData.lastDate !== today) {
    if (streakData.lastDate === yesterday) {
      // Continue streak
      streakData.count += 1;
    } else {
      // Broken streak or new start
      streakData.count = 1;
    }
    streakData.lastDate = today;
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streakData));
  }

  const newStats = {
    ...currentStats,
    workMinutes: currentStats.workMinutes + minutesToAdd,
    cycles: currentStats.cycles + cyclesToAdd,
    streak: streakData.count
  };
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
  return newStats;
};
