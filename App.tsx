import React, { useState } from 'react';
import { usePomodoro } from './hooks/usePomodoro';
import { CircularTimer } from './components/CircularTimer';
import { Notepad } from './components/Notepad';
import { StatsWidget } from './components/StatsWidget';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Menu, Sprout } from 'lucide-react';

const App: React.FC = () => {
  const {
    mode,
    timeLeft,
    isActive,
    progress,
    stats,
    switchMode,
    toggleTimer,
    resetTimer
  } = usePomodoro();

  const [isNotepadOpen, setIsNotepadOpen] = useState(false);

  // Minimalist, high-end organic gradients
  const getBackgroundClass = () => {
    switch (mode) {
      case 'work':
        // Warm Paper / Limestone
        return 'from-[#fcfcfc] via-[#f7f5f5] to-[#eceae8]';
      case 'shortBreak':
        // Morning Mist / Pale Mint
        return 'from-[#fcfdfd] via-[#f2fcf8] to-[#e6f6f4]';
      case 'longBreak':
        // Cloud / Pale Lavender
        return 'from-[#fdfdff] via-[#f7f6ff] to-[#edf0fa]';
      default:
        return 'from-stone-50 via-stone-100 to-stone-200';
    }
  };

  const getAccentColor = () => {
    switch (mode) {
      case 'work': return 'text-rose-500';
      case 'shortBreak': return 'text-teal-500';
      case 'longBreak': return 'text-indigo-500';
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col relative transition-all duration-[2000ms] ease-in-out bg-gradient-to-br animate-gradient-xy ${getBackgroundClass()}`}>
      
      {/* Particle Background - Subtle Ambient Dust */}
      <ParticlesBackground mode={mode} />

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center max-w-5xl mx-auto w-full z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-2 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm border border-white/50 transition-transform group-hover:scale-110 ${getAccentColor()}`}>
                <Sprout size={22} />
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-stone-800/90">ZenFocus</h1>
        </div>
        <button 
            onClick={() => setIsNotepadOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/40 backdrop-blur-md hover:bg-white/60 shadow-sm border border-white/50 text-stone-600 transition-all flex items-center gap-2 hover:shadow-md"
        >
            <span className="hidden sm:block text-sm font-semibold">Notes & Tasks</span>
            <Menu size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto z-10 relative">
        <div className="w-full flex flex-col items-center animate-float" style={{ animationDuration: '8s' }}>
            
            <CircularTimer 
                timeLeft={timeLeft}
                progress={progress}
                mode={mode}
                isActive={isActive}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSwitchMode={switchMode}
            />

            <StatsWidget stats={stats} mode={mode} />

        </div>
      </main>

      {/* Notepad Drawer/Panel */}
      <Notepad 
        isOpen={isNotepadOpen} 
        onClose={() => setIsNotepadOpen(false)} 
        mode={mode}
      />
      
      {/* Overlay for Notepad */}
      {isNotepadOpen && (
        <div 
            className="fixed inset-0 bg-stone-900/5 backdrop-blur-[2px] z-30 transition-opacity duration-500"
            onClick={() => setIsNotepadOpen(false)}
        ></div>
      )}

      {/* Footer */}
      <footer className="p-8 text-center text-stone-400 text-xs font-medium z-10">
        <p>Stay focused, find your flow.</p>
      </footer>

    </div>
  );
};

export default App;