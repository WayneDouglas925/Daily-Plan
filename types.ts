
export enum FastingMode {
  OMAD = 'OMAD',
  ADF = 'ADF'
}

export interface DailySlate {
  date: string;
  objectives: { id: number; text: string; completed: boolean; targetTime: string }[];
  intention: string;
  capture: string;
  reflection: string;
  submitted: boolean;
}

export interface AppState {
  isInitialized: boolean;
  equity: number;
  highWaterMark: number;
  targetBedtime: string;
  respectCircadian: boolean;
  systemMode: FastingMode;
  lastCircadianCheckDate: string | null;
  circadianDecision: 'none' | 'yes' | 'no';
  // Metrics for Architect Actions & System Audit
  actionStreaks: Record<string, number>;
  lastActionDates: Record<string, string>;
  systemDragUntil: string | null; 
  // Daily Slate
  dailySlate: DailySlate;
}

export interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export interface FloatingMetric {
  id: string;
  value: number;
  x: number;
  y: number;
  color: string;
}
