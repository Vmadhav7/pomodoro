
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  cycles: number; // Total cycles completed today
  totalWorkMinutes: number; // Total minutes focused today
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface NoteData {
  work: string;
  break: string;
  tasks: Task[];
}

export interface DailyStats {
  date: string;
  cycles: number;
  workMinutes: number;
  streak: number;
}

export enum Colors {
  Work = '#fb7185', // rose-400
  ShortBreak = '#2dd4bf', // teal-400
  LongBreak = '#818cf8', // indigo-400
}
