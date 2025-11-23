import React, { useState } from 'react';
import { TimerMode } from '../types';
import { Play, Pause, RotateCcw, Coffee, Moon, Sun } from 'lucide-react';
import { MODE_LABELS } from '../constants';

interface CircularTimerProps {
  timeLeft: number;
  progress: number;
  mode: TimerMode;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSwitchMode: (mode: TimerMode) => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const CircularTimer: React.FC<CircularTimerProps> = ({
  timeLeft,
  progress,
  mode,
  isActive,
  onToggle,
  onReset,
  onSwitchMode,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleReset = () => {
    setIsResetting(true);
    onReset();
    // Reset the animation state after a short delay
    setTimeout(() => {
      setIsResetting(false);
    }, 200);
  };

  const getTheme = () => {
    switch (mode) {
      case 'work': return {
        gradientId: 'workGradient',
        stops: [
           <stop key="1" offset="0%" stopColor="#fb7185" />,
           <stop key="2" offset="100%" stopColor="#f43f5e" />
        ],
        iconBg: 'bg-gradient-to-tr from-rose-100 to-white',
        iconColor: 'text-rose-500',
        button: 'bg-gradient-to-tr from-rose-400 to-rose-600 shadow-rose-200',
        lightStroke: 'stroke-rose-100/50',
        icon: <Sun className="w-6 h-6" />
      };
      case 'shortBreak': return {
        gradientId: 'breakGradient',
        stops: [
           <stop key="1" offset="0%" stopColor="#2dd4bf" />,
           <stop key="2" offset="100%" stopColor="#0d9488" />
        ],
        iconBg: 'bg-gradient-to-tr from-teal-100 to-white',
        iconColor: 'text-teal-600',
        button: 'bg-gradient-to-tr from-teal-400 to-teal-600 shadow-teal-200',
        lightStroke: 'stroke-teal-100/50',
        icon: <Coffee className="w-6 h-6" />
      };
      case 'longBreak': return {
        gradientId: 'longBreakGradient',
        stops: [
           <stop key="1" offset="0%" stopColor="#818cf8" />,
           <stop key="2" offset="100%" stopColor="#6366f1" />
        ],
        iconBg: 'bg-gradient-to-tr from-indigo-100 to-white',
        iconColor: 'text-indigo-600',
        button: 'bg-gradient-to-tr from-indigo-400 to-indigo-600 shadow-indigo-200',
        lightStroke: 'stroke-indigo-100/50',
        icon: <Moon className="w-6 h-6" />
      };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      
      {/* Mode Selectors */}
      <div className="flex p-1.5 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 mb-8">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onSwitchMode(m)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === m 
                ? 'bg-white shadow-md text-stone-800 scale-100' 
                : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`relative w-80 h-80 flex items-center justify-center bg-white/40 backdrop-blur-xl rounded-[48px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60 mb-10 transition-all ${isResetting ? 'duration-200 scale-95 opacity-90' : 'duration-500 scale-100 opacity-100'}`}>
        <svg className="w-full h-full transform -rotate-90 p-5 overflow-visible">
          <defs>
            <linearGradient id={theme.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {theme.stops}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth="8"
            fill="transparent"
            className={`${theme.lightStroke} transition-colors duration-500`}
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            strokeWidth="12"
            fill="transparent"
            stroke={`url(#${theme.gradientId})`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out drop-shadow-sm"
          />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <div className={`mb-4 p-4 rounded-2xl ${theme.iconBg} ${theme.iconColor} shadow-sm transition-all duration-500 ring-1 ring-white/60`}>
             {theme.icon}
           </div>
          <span className={`text-7xl font-bold tracking-tighter text-stone-800/90 tabular-nums drop-shadow-sm`}>
            {formatTime(timeLeft)}
          </span>
          <span className="mt-2 text-stone-400 font-semibold text-xs tracking-widest uppercase opacity-80">
            {isActive ? 'Flowing' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={handleReset}
          className="group p-4 rounded-2xl bg-white/50 hover:bg-white backdrop-blur-sm text-stone-400 hover:text-stone-600 transition-all duration-300 shadow-sm hover:shadow-md border border-white/50"
          aria-label="Reset Timer"
        >
          <RotateCcw size={24} className={`group-hover:-rotate-180 transition-transform duration-500 ${isResetting ? '-rotate-180' : ''}`} />
        </button>

        <button
          onClick={onToggle}
          className={`group p-7 rounded-[24px] shadow-xl hover:shadow-2xl active:shadow-inner transform transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-110 active:scale-90 text-white flex items-center justify-center border border-white/20 ${theme.button}`}
          aria-label={isActive ? "Pause Timer" : "Start Timer"}
        >
          <div className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-110'}`}>
             {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
          </div>
        </button>
      </div>
    </div>
  );
};