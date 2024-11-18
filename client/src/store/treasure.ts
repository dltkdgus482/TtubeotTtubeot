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
  checkAndResetTreasureCount: () => Promise<void>;
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
  checkAndResetTreasureCount: async () => {
    try {
      const lastResetDate = await AsyncStorage.getItem('lastResetDate');
      const today = new Date().toISOString().split('T')[0];

      if (lastResetDate !== today) {
        set({ treasureCount: 0 });
        await AsyncStorage.setItem('lastResetDate', today);
        // console.log('Treasure count reset for the day');
      } else {
        // console.log('Treasure count is up-to-date');
      }
    } catch (error) {
      console.error('Error checking treasure count reset:', error);
    }
  },
}));

export default useTreasureStore;
