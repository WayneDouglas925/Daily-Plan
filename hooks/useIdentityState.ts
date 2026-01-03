
import { useState, useEffect, useCallback } from 'react';
import { AppState, FastingMode, DailySlate } from '../types';
import { getTodayString } from '../utils/timeUtils';

const STORAGE_KEY = 'identity_2026_state';

const createEmptySlate = (): DailySlate => ({
  date: getTodayString(),
  objectives: [
    { id: 1, text: '', completed: false, targetTime: '' },
    { id: 2, text: '', completed: false, targetTime: '' },
    { id: 3, text: '', completed: false, targetTime: '' },
  ],
  intention: '',
  capture: '',
  reflection: '',
  submitted: false,
});

const DEFAULT_STATE: AppState = {
  isInitialized: false,
  equity: 0,
  highWaterMark: 100,
  targetBedtime: '22:00',
  respectCircadian: true,
  systemMode: FastingMode.OMAD,
  lastCircadianCheckDate: null,
  circadianDecision: 'none',
  actionStreaks: {},
  lastActionDates: {},
  systemDragUntil: null,
  dailySlate: createEmptySlate(),
};

export const useIdentityState = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : DEFAULT_STATE;
    
    // Check if we need a new slate for a new day
    const today = getTodayString();
    if (parsed.dailySlate && parsed.dailySlate.date !== today) {
      parsed.dailySlate = createEmptySlate();
      parsed.circadianDecision = 'none';
      parsed.lastCircadianCheckDate = today;
    }
    
    return parsed;
  });
  
  const [isBooting, setIsBooting] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateField = useCallback(<K extends keyof AppState>(key: K, value: AppState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSlate = useCallback((updates: Partial<DailySlate>) => {
    setState(prev => ({
      ...prev,
      dailySlate: { ...prev.dailySlate, ...updates }
    }));
  }, []);

  const handleCircadianDecision = (decision: 'yes' | 'no') => {
    const prevDecision = state.circadianDecision;
    if (prevDecision === decision) return { value: 0 };

    let netChange = 0;

    // Reason: Reverse previous decision impact if changing mind on the same day
    if (prevDecision === 'yes') netChange -= 10;
    if (prevDecision === 'no') netChange += 15;

    // Apply new decision impact
    const reward = decision === 'yes' ? 10 : -15;
    netChange += reward;

    setState(prev => {
      const newEquity = Math.max(0, prev.equity + netChange);
      const newHWM = Math.max(prev.highWaterMark, newEquity);
      return {
        ...prev,
        equity: newEquity,
        highWaterMark: newHWM,
        circadianDecision: decision,
        lastCircadianCheckDate: getTodayString()
      };
    });

    return { value: reward };
  };

  const initializeSystem = async () => {
    setIsBooting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setState(prev => ({
      ...prev,
      isInitialized: true,
      equity: 100,
      highWaterMark: 100,
    }));
    
    setIsBooting(false);
  };

  const performRecoveryRitual = async () => {
    setIsRecovering(true);
    setState(prev => ({
      ...prev,
      equity: prev.highWaterMark,
    }));
    // Celebrate with blue glow for 5 seconds
    setTimeout(() => setIsRecovering(false), 5000);
  };

  const hardReset = () => {
    if (confirm("HARD RESET: Wipe all protocol data and refresh?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const isSystemDragActive = () => {
    if (!state.systemDragUntil) return false;
    return new Date(state.systemDragUntil) > new Date();
  };

  const performAction = (actionId: string, baseValue: number, isArchitect: boolean, isContaminant: boolean = false) => {
    const today = getTodayString();
    const lastDate = state.lastActionDates[actionId];
    let newStreak = state.actionStreaks[actionId] || 0;

    if (isArchitect) {
      if (!lastDate) {
        newStreak = 1;
      } else {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
    }

    const multiplier = isArchitect ? Math.min(2.0, 1 + (newStreak - 1) * 0.1) : 1;
    const dragActive = isSystemDragActive();
    const dragReduction = (isArchitect && dragActive) ? 0.8 : 1;
    const finalValue = baseValue * multiplier * dragReduction;

    setState(prev => {
      const newEquity = Math.max(0, prev.equity + finalValue);
      const newHWM = Math.max(prev.highWaterMark, newEquity);
      
      let systemDragUntil = prev.systemDragUntil;
      if (isContaminant) {
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        systemDragUntil = tomorrow.toISOString();
      }

      return {
        ...prev,
        equity: newEquity,
        highWaterMark: newHWM,
        systemDragUntil,
        actionStreaks: { ...prev.actionStreaks, [actionId]: newStreak },
        lastActionDates: { ...prev.lastActionDates, [actionId]: today }
      };
    });

    return { finalValue, multiplier, streak: newStreak, dragActive };
  };

  const debt = Math.max(0, state.highWaterMark - state.equity);

  return {
    state,
    debt,
    isBooting,
    isRecovering,
    isSystemDragActive: isSystemDragActive(),
    updateField,
    updateSlate,
    initializeSystem,
    hardReset,
    performAction,
    performRecoveryRitual,
    handleCircadianDecision
  };
};
