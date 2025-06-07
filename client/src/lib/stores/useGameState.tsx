import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "paused" | "ended";

interface GameState {
  gamePhase: GamePhase;
  currentRegion: string | null;
  isLoading: boolean;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  setCurrentRegion: (region: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    currentRegion: null,
    isLoading: false,
    
    startGame: () => {
      set({ gamePhase: "playing", isLoading: false });
    },
    
    pauseGame: () => {
      set({ gamePhase: "paused" });
    },
    
    resumeGame: () => {
      set({ gamePhase: "playing" });
    },
    
    endGame: () => {
      set({ gamePhase: "ended" });
    },
    
    setCurrentRegion: (region) => {
      set({ currentRegion: region });
      console.log('Current region:', region);
    },
    
    setLoading: (loading) => {
      set({ isLoading: loading });
    }
  }))
);
