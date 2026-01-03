
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Flame, 
  Zap, 
  TrendingUp, 
  ArrowDownCircle, 
  RotateCcw,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Hammer,
  AlertTriangle,
  Skull,
  Activity,
  Calendar,
  PenTool,
  CheckCircle2,
  Lock,
  ArrowRightCircle,
  Dumbbell,
  Sun
} from 'lucide-react';
import confetti from 'https://esm.sh/canvas-confetti@1.6.0';
import { useIdentityState } from './hooks/useIdentityState';
import { FastingMode, FloatingMetric as FloatingMetricType } from './types';
import { calculateKitchenCloseTime } from './utils/timeUtils';
import IdentityOrb from './components/IdentityOrb';
import ParticleSystem from './components/ParticleSystem';
import DashboardCard from './components/DashboardCard';
import InitializationModal from './components/InitializationModal';
import FloatingMetric from './components/FloatingMetric';
import CountdownTimer from './components/CountdownTimer';

const App: React.FC = () => {
  const { 
    state, 
    debt, 
    isBooting, 
    isRecovering,
    isSystemDragActive, 
    updateField, 
    updateSlate,
    initializeSystem, 
    hardReset, 
    performAction,
    performRecoveryRitual,
    handleCircadianDecision
  } = useIdentityState();
  
  const [floatingMetrics, setFloatingMetrics] = useState<FloatingMetricType[]>([]);

  const kitchenCloseTime = useMemo(() => 
    calculateKitchenCloseTime(state.targetBedtime), 
    [state.targetBedtime]
  );

  const addFloatingMetric = (value: number, x: number, y: number, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingMetrics(prev => [...prev, { id, value, x, y, color }]);
  };

  const handleActionClick = (
    e: React.MouseEvent, 
    id: string, 
    value: number, 
    isArch: boolean, 
    isContam: boolean = false,
    color: string
  ) => {
    const { finalValue } = performAction(id, value, isArch, isContam);
    addFloatingMetric(finalValue, e.clientX, e.clientY, color);
  };

  const handleCircadianChoice = (e: React.MouseEvent, decision: 'yes' | 'no') => {
    const { value } = handleCircadianDecision(decision);
    if (value !== 0) {
      addFloatingMetric(value, e.clientX, e.clientY, decision === 'yes' ? '#10b981' : '#ef4444');
    }
  };

  const isReflectionLocked = useMemo(() => {
    const [h, m] = state.targetBedtime.split(':').map(Number);
    const now = new Date();
    const unlockTime = new Date();
    unlockTime.setHours(h - 3, m, 0, 0);
    // Handle wraparound if bedtime is early morning
    if (unlockTime > now && h < 12) {
       unlockTime.setDate(unlockTime.getDate() - 1);
    }
    return now < unlockTime;
  }, [state.targetBedtime]);

  const handleSlateSubmit = () => {
    if (state.dailySlate.reflection.length < 5) return;
    updateSlate({ submitted: true });
    if (debt === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });
    }
  };

  const showInitModal = !state.isInitialized || state.equity === 0;

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans transition-all duration-1000 ${isSystemDragActive ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.3)]' : ''}`}>
      
      {/* North Star Header */}
      <div className="w-full py-2 bg-white/5 border-b border-white/5 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40">
          North Star: Disciplined, Structured, and Built for Success.
        </p>
      </div>

      {/* System Drag Vignette */}
      {isSystemDragActive && (
        <div className="fixed inset-0 pointer-events-none z-[90] border-[40px] border-red-900/10 blur-3xl" />
      )}

      <AnimatePresence>
        {showInitModal && (
          <InitializationModal 
            onInit={initializeSystem} 
            isBooting={isBooting} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {floatingMetrics.map(m => (
          <FloatingMetric 
            key={m.id} 
            {...m} 
            onComplete={() => setFloatingMetrics(prev => prev.filter(x => x.id !== m.id))} 
          />
        ))}
      </AnimatePresence>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent uppercase">
            The Re-Build
          </h1>
          <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">Identity-2026 Protocol</p>
        </div>
        <div className="flex items-center gap-4">
          {isSystemDragActive && (
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-wider"
            >
              <Activity size={12} /> System Drag Active
            </motion.div>
          )}
          <button 
            onClick={hardReset}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={18} className="text-white/60" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          
          <div className="flex flex-col items-center justify-center py-8 relative min-h-[400px]">
            <ParticleSystem />
            <IdentityOrb 
              debt={debt} 
              equity={state.equity} 
              isBooting={isBooting} 
              isRecovering={isRecovering}
            />
          </div>

          {/* Recovery Mechanic */}
          {debt > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-600/10 border border-blue-500/40 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
                  <Dumbbell size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Identity Recovery Available</h3>
                  <p className="text-white/50 text-sm">Clear Protocol Debt through physical exertion</p>
                </div>
              </div>
              <button
                onClick={performRecoveryRitual}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Perform Recovery Ritual (30m Exercise)
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Architect Actions */}
            <DashboardCard title="Architect Actions" subtitle="High-value identity construction">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'cold_start', label: 'Cold Start', val: 10 },
                  { id: 'deep_work', label: 'Deep Work 90m', val: 15 },
                  { id: 'struct_prep', label: 'Structural Prep', val: 5 },
                  { id: 'skill_mastery', label: 'Skill Mastery', val: 10 },
                ].map(action => {
                  const streak = state.actionStreaks[action.id] || 0;
                  const mult = Math.min(2.0, 1 + (streak - 1) * 0.1);
                  return (
                    <button
                      key={action.id}
                      onClick={(e) => handleActionClick(e, action.id, action.val, true, false, '#22d3ee')}
                      className="group relative flex items-center justify-between p-4 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                          <Hammer size={18} />
                        </div>
                        <span className="font-bold text-cyan-50/90">{action.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {streak > 1 && (
                          <span className="text-[10px] font-black bg-cyan-500/40 px-2 py-0.5 rounded text-white">
                            {mult.toFixed(1)}x Streak
                          </span>
                        )}
                        <span className="text-xs font-bold text-cyan-400/60">+{action.val}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </DashboardCard>

            {/* System Audit */}
            <DashboardCard title="System Audit" subtitle="Penalties and contaminants">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                   <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest mb-1">Penalties</p>
                   <div className="grid grid-cols-2 gap-2">
                     <button 
                       onClick={(e) => handleActionClick(e, 'snooze', -5, false, false, '#f97316')}
                       className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-200 hover:bg-orange-500/10 transition-all"
                     >
                       Snooze Alarm (-5)
                     </button>
                     <button 
                       onClick={(e) => handleActionClick(e, 'messy', -5, false, false, '#f97316')}
                       className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-200 hover:bg-orange-500/10 transition-all"
                     >
                       Messy Workspace (-5)
                     </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                   <p className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest mb-1">Contaminants (24h Drag)</p>
                   <div className="flex flex-wrap gap-2">
                     {['Cigarette', 'Beer', 'Junk Food'].map(item => (
                       <button 
                         key={item}
                         onClick={(e) => handleActionClick(e, item.toLowerCase().replace(' ', '_'), -20, false, true, '#dc2626')}
                         className="flex-1 min-w-[100px] p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs font-bold text-red-400 hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                       >
                         <Skull size={12} /> {item} (-20)
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* DAILY SLATE */}
          <div className="grid grid-cols-1 gap-8">
            <DashboardCard title="The Daily Slate" subtitle="Primary alignment and closure">
               <div className="space-y-8">
                 {/* Header Date */}
                 <div className="flex items-center gap-3 text-indigo-400">
                    <Calendar size={18} />
                    <span className="font-display font-bold tracking-[0.2em]">[[{state.dailySlate.date}]]</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Today's 3 */}
                    <div className="space-y-4">
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Today's 3 Primary Objectives</p>
                       {state.dailySlate.objectives.map((obj, i) => (
                         <motion.div 
                           key={obj.id} 
                           layout 
                           className="flex flex-col gap-2"
                         >
                           <div className="flex items-center gap-3 group/obj">
                              <motion.button 
                                whileTap={{ scale: 0.8 }}
                                onClick={() => {
                                  const newObjs = [...state.dailySlate.objectives];
                                  newObjs[i].completed = !newObjs[i].completed;
                                  updateSlate({ objectives: newObjs });
                                }}
                                className={`p-1 rounded-md border shrink-0 transition-colors duration-500 ${obj.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 text-white/10 hover:border-white/20'}`}
                              >
                                <motion.div
                                  initial={false}
                                  animate={obj.completed ? { scale: [1, 1.4, 1], rotate: [0, 10, 0] } : { scale: 1 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <CheckCircle2 size={16} />
                                </motion.div>
                              </motion.button>
                              
                              <div className="relative flex-1">
                                <input 
                                  type="text"
                                  placeholder="Objective..."
                                  value={obj.text}
                                  onChange={(e) => {
                                    const newObjs = [...state.dailySlate.objectives];
                                    newObjs[i].text = e.target.value;
                                    updateSlate({ objectives: newObjs });
                                  }}
                                  className={`w-full bg-transparent border-b border-white/5 py-1 text-sm outline-none transition-all duration-700 ${obj.completed ? 'text-white/20 border-white/0' : 'text-white focus:border-indigo-500/50'}`}
                                />
                                {/* Strikethrough Flourish */}
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: obj.completed ? '100%' : '0%' }}
                                  transition={{ duration: 0.6, ease: "easeInOut" }}
                                  className="absolute left-0 top-[1.2rem] h-[1px] bg-white/10 pointer-events-none"
                                />
                              </div>

                              <input 
                                type="time"
                                value={obj.targetTime}
                                onChange={(e) => {
                                  const newObjs = [...state.dailySlate.objectives];
                                  newObjs[i].targetTime = e.target.value;
                                  updateSlate({ objectives: newObjs });
                                }}
                                className={`bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[10px] outline-none focus:border-indigo-500/50 transition-opacity duration-500 ${obj.completed ? 'opacity-20' : 'opacity-100 text-white/60'}`}
                              />
                           </div>
                           {!obj.completed && obj.targetTime && (
                             <div className="pl-9">
                               <CountdownTimer targetTime={obj.targetTime} />
                             </div>
                           )}
                         </motion.div>
                       ))}
                    </div>

                    {/* Intention & Capture */}
                    <div className="space-y-6">
                       <div>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <PenTool size={10} /> Intention
                          </p>
                          <input 
                            type="text"
                            placeholder="One word or phrase..."
                            value={state.dailySlate.intention}
                            onChange={(e) => updateSlate({ intention: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-500/50"
                          />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Capture Dump</p>
                          <textarea 
                            rows={3}
                            placeholder="Thoughts, notes, data..."
                            value={state.dailySlate.capture}
                            onChange={(e) => updateSlate({ capture: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/50 resize-none"
                          />
                       </div>
                    </div>
                 </div>

                 {/* The Close */}
                 <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">The Close: One-Sentence Reflection</p>
                       {isReflectionLocked && (
                         <span className="flex items-center gap-2 text-[10px] text-amber-500/60 font-bold uppercase tracking-wider">
                           <Lock size={10} /> Locked until 3hrs before bed
                         </span>
                       )}
                    </div>
                    <div className="relative">
                      <textarea 
                        disabled={isReflectionLocked || state.dailySlate.submitted}
                        value={state.dailySlate.reflection}
                        onChange={(e) => updateSlate({ reflection: e.target.value })}
                        rows={2}
                        placeholder={isReflectionLocked ? "Evaluation period has not yet begun..." : "Summarize today's impact..."}
                        className={`w-full p-4 rounded-2xl text-lg font-display transition-all resize-none outline-none ${
                          isReflectionLocked 
                          ? 'bg-white/2 border-white/5 text-white/10 cursor-not-allowed' 
                          : 'bg-white/5 border border-white/10 focus:border-indigo-500 focus:bg-white/10'
                        }`}
                      />
                    </div>
                    {!state.dailySlate.submitted && !isReflectionLocked && (
                      <button 
                        onClick={handleSlateSubmit}
                        className="mt-4 w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20"
                        disabled={state.dailySlate.reflection.length < 5}
                      >
                        <ArrowRightCircle size={20} />
                        Submit Final Protocol Entry
                      </button>
                    )}
                    {state.dailySlate.submitted && (
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3 text-emerald-400 font-bold">
                        <CheckCircle2 size={20} /> Protocol Entry Finalized
                      </div>
                    )}
                 </div>
               </div>
            </DashboardCard>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={40} />
              </div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Equity</p>
              <p className="text-3xl font-display font-bold text-emerald-400">{Math.round(state.equity)}</p>
            </div>
            <div className="glass p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle size={40} />
              </div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Active Debt</p>
              <p className="text-3xl font-display font-bold text-amber-500">{Math.round(debt)}</p>
            </div>
          </div>

          <DashboardCard title="Circadian Rhythms">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Moon size={14} /> Target Bedtime
                </label>
                <input 
                  type="time" 
                  value={state.targetBedtime}
                  onChange={(e) => updateField('targetBedtime', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold outline-none focus:border-indigo-500"
                />
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-wider">Kitchen Must Close By</p>
                  <p className="text-2xl font-display font-bold text-emerald-400">{kitchenCloseTime}</p>
                </div>
                <Clock className="text-emerald-500/40" size={32} />
              </div>

              {/* Circadian Toggle decision UI */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Respect the Circadian Window?</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-tighter">No food after dark and 3h before sleep</p>
                </div>
                <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                  <button
                    onClick={(e) => handleCircadianChoice(e, 'yes')}
                    className={`py-2 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                      state.circadianDecision === 'yes' ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Sun size={12} /> Yes (+10)
                  </button>
                  <button
                    onClick={(e) => handleCircadianChoice(e, 'no')}
                    className={`py-2 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 ${
                      state.circadianDecision === 'no' ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <AlertTriangle size={12} /> No (-15)
                  </button>
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="System Mode">
            <div className="space-y-4">
              <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {(['OMAD', 'ADF'] as FastingMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => updateField('systemMode', m)}
                    className={`py-2 rounded-xl font-bold transition-all text-sm ${
                      state.systemMode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => handleActionClick(e, 'fast_complete', state.systemMode === 'OMAD' ? 10 : 20, false, false, '#818cf8')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-xl flex items-center justify-between group transition-all"
              >
                <span className="font-bold text-sm">Window Completed</span>
                <Zap size={18} />
              </button>
            </div>
          </DashboardCard>
        </section>
      </main>

      <footer className="relative z-10 w-full pb-32 pt-10 px-10 text-center flex flex-col items-center gap-4">
        <button 
          onClick={hardReset}
          className="text-white/10 hover:text-white/30 text-[10px] uppercase font-bold tracking-[0.3em] flex items-center gap-2"
        >
          <Settings size={10} /> Reset System Initialization
        </button>
      </footer>
    </div>
  );
};

export default App;
