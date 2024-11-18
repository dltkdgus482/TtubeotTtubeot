import { create } from 'zustand';
// import { persist, PersistStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface Adventure {
  socketConnected: boolean;
  setSocketConnected: (socketConnected: boolean) => void;
}

const useAdventureStore = create<Adventure>(set => ({
  socketConnected: false,
  setSocketConnected: value => set({ socketConnected: value }),
}));

export default useAdventureStore;
