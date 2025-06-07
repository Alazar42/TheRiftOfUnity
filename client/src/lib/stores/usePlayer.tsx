import { create } from "zustand";

interface Position {
  x: number;
  y: number;
}

interface PlayerStats {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
}

interface PlayerState {
  position: Position;
  playerStats: PlayerStats;
  name: string;
  
  // Actions
  setPosition: (position: Position) => void;
  updateStats: (stats: Partial<PlayerStats>) => void;
  resetPlayer: () => void;
}

const initialPosition: Position = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300
};

const initialStats: PlayerStats = {
  health: 100,
  maxHealth: 100,
  energy: 100,
  maxEnergy: 100
};

export const usePlayer = create<PlayerState>((set, get) => ({
  position: initialPosition,
  playerStats: initialStats,
  name: "Tsega",
  
  setPosition: (position) => {
    set({ position });
  },
  
  updateStats: (stats) => {
    set((state) => ({
      playerStats: { ...state.playerStats, ...stats }
    }));
  },
  
  resetPlayer: () => {
    set({
      position: initialPosition,
      playerStats: initialStats
    });
  }
}));
