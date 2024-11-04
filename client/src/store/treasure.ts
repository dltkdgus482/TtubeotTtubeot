import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Treasure {
  hasTreasure: boolean;
  setHasTreasure: (value: boolean) => void;
}

const useTreasureStore = create<Treasure>(set => ({
  hasTreasure: false,
  setHasTreasure: value => set({ hasTreasure: value }),
}));

export default useTreasureStore;
