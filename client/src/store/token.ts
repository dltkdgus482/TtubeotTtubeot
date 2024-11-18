import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TokenState {
  accessToken: string;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

// AsyncStorage를 zustand persist에 맞게 래핑하는 함수
const asyncStorageWrapper: PersistStorage<TokenState> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null; // JSON으로 파싱 후 반환
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value)); // JSON으로 변환 후 저장
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useToken = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: '',

      setAccessToken: (token: string) => set(() => ({ accessToken: token })),

      // 로그아웃 시 또는 필요할 때 사용자 정보 지우기
      clearAccessToken: () => set(() => ({ accessToken: '' })),
    }),
    {
      name: 'token-storage', // AsyncStorage 키 이름
      storage: asyncStorageWrapper, // 래퍼 사용
    }
  )
);
