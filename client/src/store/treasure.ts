import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Treasure {
  hasTreasure: boolean;
  isDigging: boolean;
  nearbyTreasure: boolean;
  treasureCount: number;
  currentReward: number;
  setHasTreasure: (value: boolean) => void;
  setIsDigging: (value: boolean) => void;
  setNearbyTreasure: (value: boolean) => void;
  setTreasureCount: (value: number) => void;
  setCurrentReward: (value: number) => void;
}

const useTreasureStore = create<Treasure>(set => ({
  hasTreasure: false,
  isDigging: false,
  nearbyTreasure: false,
  treasureCount: 0,
  currentReward: 0,
  setHasTreasure: value => set({ hasTreasure: value }),
  setIsDigging: value => set({ isDigging: value }),
  setNearbyTreasure: value => set({ nearbyTreasure: value }),
  setTreasureCount: value => set({ treasureCount: value }),
  setCurrentReward: value => set({ currentReward: value }),
}));

export default useTreasureStore;
