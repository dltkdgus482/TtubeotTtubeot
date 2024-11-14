import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Treasure {
  hasTreasure: boolean;
  isDigging: boolean;
  setHasTreasure: (value: boolean) => void;
  setIsDigging: (value: boolean) => void;
}

const useTreasureStore = create<Treasure>(set => ({
  hasTreasure: false,
  isDigging: false,
  setHasTreasure: value => set({ hasTreasure: value }),
  setIsDigging: value => set({ isDigging: value }),
}));

export default useTreasureStore;
