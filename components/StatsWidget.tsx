
import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { DailyStats, TimerMode } from '../types';
import { Flame, Clock, BarChart2 } from 'lucide-react';

interface StatsWidgetProps {
  stats: DailyStats;
  mode?: TimerMode;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, mode = 'work' }) => {
  const data = [
    { name: 'Focus', value: stats.workMinutes },
    { name: 'Goal Left', value: Math.max(0, (4 * 25) - stats.workMinutes) },
  ];
  
  // Dynamic colors based on mode for visual harmony
  const getColors = () => {
    switch(mode) {
        case 'shortBreak': return ['#2dd4bf', '#ccfbf1']; // Teal
        case 'longBreak': return ['#818cf8', '#e0e7ff']; // Indigo
        default: return ['#fb7185', '#ffe4e6']; // Rose
    }
  };
  
  const COLORS = getColors();

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 opacity-0 animate-[float_1s_ease-out_0.5s_forwards] fill-mode-forwards" style={{ opacity: 1 }}>
      
      {/* Card 1: Daily Focus Minutes */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-36 group">
        <div className="z-10 relative">
            <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-stone-400" />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Today</span>
            </div>
            <div className="text-3xl font-bold text-stone-800 tracking-tight">
                {Math.round(stats.workMinutes)} <span className="text-sm font-semibold text-stone-400">min</span>
            </div>
        </div>
        
        {/* Fixed size PieChart to avoid ResponsiveContainer warning */}
        <div className="absolute -bottom-2 -right-2 w-28 h-28 opacity-80 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
            <PieChart width={112} height={112}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={40}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
                isAnimationActive={false} 
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
        </div>
      </div>

      {/* Card 2: Streak (Prominent display next to Focus) */}
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36 relative overflow-hidden group">
         <div className="z-10 relative">
            <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className={stats.streak > 0 ? "fill-orange-500 text-orange-500" : "text-stone-400"} />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
                <div className="text-3xl font-bold text-stone-800 tracking-tight">
                    {stats.streak}
                </div>
                <span className="text-sm font-semibold text-stone-400">days</span>
            </div>
         </div>
         
         {/* Flame Icon Background */}
         <div className="absolute right-3 bottom-3 p-3 rounded-full bg-orange-100/50 text-orange-500 group-hover:scale-110 transition-transform duration-300">
             <Flame size={28} className={stats.streak > 0 ? "fill-orange-500 animate-pulse-soft" : "text-stone-300 fill-stone-200"} />
         </div>

         {/* Glow effect for active streak */}
         {stats.streak > 0 && (
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-200/20 blur-3xl rounded-full pointer-events-none"></div>
         )}
      </div>

      {/* Card 3: Sessions Progress */}
      <div className="col-span-2 md:col-span-1 bg-white/40 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36">
         <div>
            <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={14} className="text-stone-400" />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Sessions</span>
            </div>
            <div className="text-3xl font-bold text-stone-800 tracking-tight">
                {stats.cycles} <span className="text-sm font-semibold text-stone-400">/ 8</span>
            </div>
         </div>
         <div className="w-full bg-stone-200/50 rounded-full h-3 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${mode === 'shortBreak' ? 'from-teal-400 to-teal-500' : mode === 'longBreak' ? 'from-indigo-400 to-indigo-500' : 'from-rose-400 to-rose-500'}`}
                style={{ width: `${Math.min(100, (stats.cycles / 8) * 100)}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
};
