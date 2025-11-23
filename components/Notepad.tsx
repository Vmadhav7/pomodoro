import React, { useEffect, useState, useRef } from 'react';
import { NoteData, Task, TimerMode } from '../types';
import { loadNotes, saveNotes } from '../utils/storage';
import { X, Check, Trash2, Plus, PenLine, CheckSquare } from 'lucide-react';

interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: TimerMode;
}

export const Notepad: React.FC<NotepadProps> = ({ isOpen, onClose, mode = 'work' }) => {
  const [notes, setNotes] = useState<NoteData>({ work: '', break: '', tasks: [] });
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [newTaskText, setNewTaskText] = useState('');
  const tasksEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  const saveToStorage = (updatedNotes: NoteData) => {
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedNotes = { ...notes, work: e.target.value };
    saveToStorage(updatedNotes);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };

    const updatedNotes = { ...notes, tasks: [...notes.tasks, newTask] };
    saveToStorage(updatedNotes);
    setNewTaskText('');
    setTimeout(() => tasksEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = notes.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveToStorage({ ...notes, tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = notes.tasks.filter(t => t.id !== taskId);
    saveToStorage({ ...notes, tasks: updatedTasks });
  };

  const getGradientText = () => {
    switch(mode) {
        case 'shortBreak': return 'text-teal-600';
        case 'longBreak': return 'text-indigo-600';
        default: return 'text-rose-600';
    }
  };

  const getButtonGradient = () => {
      switch(mode) {
        case 'shortBreak': return 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500';
        case 'longBreak': return 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500';
        default: return 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500';
      }
  };

  return (
    <div className={`
      fixed inset-y-0 right-0 z-40 w-full sm:w-[450px] 
      bg-white/80 backdrop-blur-xl shadow-2xl 
      transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
      border-l border-white/50 flex flex-col
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className={`text-2xl font-bold tracking-tight ${getGradientText()}`}>My Space</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 gap-8 border-b border-stone-100/50">
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'notes' 
              ? `border-current ${getGradientText()}` 
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <PenLine size={18} />
          Thoughts
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-4 text-sm font-bold transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'tasks' 
              ? `border-current ${getGradientText()}` 
              : 'border-transparent text-stone-400 hover:text-stone-600'
          }`}
        >
          <CheckSquare size={18} />
          Tasks
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-transparent to-stone-50/30">
        
        {/* NOTES MODE */}
        <div className={`absolute inset-0 p-6 flex flex-col transition-all duration-300 ${activeTab === 'notes' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
          <div className="flex-1 bg-white/60 rounded-2xl shadow-sm border border-stone-100/50 p-1 focus-within:ring-2 focus-within:ring-stone-100 transition-all">
             <textarea
                value={notes.work}
                onChange={handleTextChange}
                placeholder="Clear your mind..."
                className="w-full h-full resize-none p-5 bg-transparent border-none focus:ring-0 text-stone-600 leading-relaxed placeholder:text-stone-300 text-base font-medium"
                spellCheck={false}
            />
          </div>
          <div className="mt-3 flex items-center justify-end gap-2 text-xs text-stone-400 font-medium">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
             Auto-saving
          </div>
        </div>

        {/* TASKS MODE */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'tasks' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
          
          {/* Input */}
          <div className="p-6 pb-2">
            <form onSubmit={addTask} className="relative group">
                <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..." 
                    className="w-full p-4 pr-14 bg-white/70 rounded-2xl border border-stone-200 
                    focus:border-stone-300 focus:bg-white 
                    focus:ring-4 focus:ring-stone-50/50 
                    focus:shadow-2xl focus:scale-[1.03] focus:-translate-y-1.5
                    outline-none transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    placeholder:text-stone-300 text-stone-700 font-medium transform"
                />
                <button 
                    type="submit"
                    disabled={!newTaskText.trim()}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 ${getButtonGradient()}`}
                >
                    <Plus size={20} />
                </button>
            </form>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar">
            {notes.tasks.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center text-stone-300 space-y-3">
                    <div className="p-4 bg-stone-50 rounded-full">
                        <CheckSquare size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium">No tasks yet</span>
                </div>
            )}
            
            {notes.tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-stone-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-stone-200 hover:scale-[1.02] ${task.completed ? 'opacity-60 bg-stone-50/50 grayscale' : 'opacity-100'}`}
              >
                <button 
                    onClick={() => toggleTask(task.id)} 
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                        ? 'bg-stone-800 border-stone-800 text-white scale-100' 
                        : 'border-stone-200 text-transparent hover:border-stone-400 scale-95 hover:scale-100'
                    }`}
                >
                    <Check size={14} strokeWidth={4} />
                </button>
                
                <span className={`flex-1 text-sm font-medium leading-relaxed pt-0.5 ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                    {task.text}
                </span>

                <button 
                    onClick={() => deleteTask(task.id)} 
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition-all transform hover:rotate-12"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div ref={tasksEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};