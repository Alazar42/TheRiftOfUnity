import { create } from "zustand";

interface Region {
  name: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  hasMetLeader: boolean;
  virtue: string;
}

interface Relic {
  id: string;
  name: string;
  description: string;
  virtue: string;
}

interface WorldState {
  regions: { [key: string]: Region };
  unlockedRegions: string[];
  relics: Relic[];
  worldTransformation: number; // 0-100, increases as relics are collected
  
  // Actions
  unlockRegion: (regionKey: string) => void;
  completeRegion: (regionKey: string) => void;
  setLeaderMet: (regionKey: string) => void;
  addRelic: (relic: Relic) => void;
  updateWorldTransformation: () => void;
  resetWorld: () => void;
}

const initialRegions: { [key: string]: Region } = {
  faith: {
    name: "Faith",
    isUnlocked: true, // Starting region
    isCompleted: false,
    hasMetLeader: false,
    virtue: "Faith"
  },
  compassion: {
    name: "Compassion",
    isUnlocked: false,
    isCompleted: false,
    hasMetLeader: false,
    virtue: "Compassion"
  },
  strength: {
    name: "Strength",
    isUnlocked: false,
    isCompleted: false,
    hasMetLeader: false,
    virtue: "Strength"
  },
  wisdom: {
    name: "Wisdom",
    isUnlocked: false,
    isCompleted: false,
    hasMetLeader: false,
    virtue: "Wisdom"
  },
  truth: {
    name: "Truth",
    isUnlocked: false,
    isCompleted: false,
    hasMetLeader: false,
    virtue: "Truth"
  }
};

export const useWorld = create<WorldState>((set, get) => ({
  regions: initialRegions,
  unlockedRegions: ['faith'], // Faith is unlocked from the start
  relics: [],
  worldTransformation: 0,
  
  unlockRegion: (regionKey) => {
    set((state) => {
      const newUnlockedRegions = state.unlockedRegions.includes(regionKey) 
        ? state.unlockedRegions 
        : [...state.unlockedRegions, regionKey];
        
      return {
        unlockedRegions: newUnlockedRegions,
        regions: {
          ...state.regions,
          [regionKey]: {
            ...state.regions[regionKey],
            isUnlocked: true
          }
        }
      };
    });
  },
  
  completeRegion: (regionKey) => {
    set((state) => {
      const updatedRegions = {
        ...state.regions,
        [regionKey]: {
          ...state.regions[regionKey],
          isCompleted: true
        }
      };
      
      return { regions: updatedRegions };
    });
    
    // Update world transformation after completing a region
    get().updateWorldTransformation();
  },
  
  setLeaderMet: (regionKey) => {
    set((state) => ({
      regions: {
        ...state.regions,
        [regionKey]: {
          ...state.regions[regionKey],
          hasMetLeader: true
        }
      }
    }));
  },
  
  addRelic: (relic) => {
    set((state) => {
      // Check if relic already exists
      const existingRelic = state.relics.find(r => r.id === relic.id);
      if (existingRelic) return state;
      
      const newRelics = [...state.relics, relic];
      
      // Auto-unlock next region based on collection order
      const regionOrder = ['faith', 'compassion', 'strength', 'wisdom', 'truth'];
      const currentIndex = regionOrder.indexOf(relic.id);
      const nextRegionKey = regionOrder[currentIndex + 1];
      
      let newUnlockedRegions = state.unlockedRegions;
      if (nextRegionKey && !state.unlockedRegions.includes(nextRegionKey)) {
        newUnlockedRegions = [...state.unlockedRegions, nextRegionKey];
      }
      
      return {
        relics: newRelics,
        unlockedRegions: newUnlockedRegions,
        regions: nextRegionKey ? {
          ...state.regions,
          [nextRegionKey]: {
            ...state.regions[nextRegionKey],
            isUnlocked: true
          }
        } : state.regions
      };
    });
    
    get().updateWorldTransformation();
  },
  
  updateWorldTransformation: () => {
    const { relics } = get();
    const transformation = (relics.length / 5) * 100;
    set({ worldTransformation: transformation });
  },
  
  resetWorld: () => {
    set({
      regions: initialRegions,
      unlockedRegions: ['faith'],
      relics: [],
      worldTransformation: 0
    });
  }
}));
