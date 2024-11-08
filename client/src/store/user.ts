import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  userId: string;
  userName: string;
  phoneNumber: string;
  userLocationAgreement: number; // 0 - 동의 안함, 1 - 동의
  userPushNotificationAgreement: number; // 0 - 동의 안함, 1 - 동의
  userType: number; // 0 - 자녀, 1 - 부모
  goal: number;
  coin: number;
  userParent: number;
}

interface UserState {
  user: User;
  isLoggedIn: boolean;
  accessToken: string | null;
  ttubeotId: number;
  setUser: (user: User) => void;
  setIsLoggedIn: (status: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setTtubeotId: (ttubeotId: number) => void;
  clearUser: () => void;
}

// AsyncStorage를 zustand persist에 맞게 래핑하는 함수
const asyncStorageWrapper: PersistStorage<UserState> = {
  getItem: async name => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async name => {
    await AsyncStorage.removeItem(name);
  },
};

export const useUser = create<UserState>()(
  persist(
    set => ({
      user: {
        userId: '',
        userName: '',
        phoneNumber: '',
        userLocationAgreement: 0,
        userPushNotificationAgreement: 0, // 기본값: 동의 안함
        userType: 0, // 0 자녀 or 1 부모
        goal: 0,
        coin: 0,
        userParent: 0,
      },
      ttubeotId: 0,
      isLoggedIn: false,
      accessToken: null,

      setUser: (user: User) => set(() => ({ user })),
      setIsLoggedIn: (status: boolean) => set(() => ({ isLoggedIn: status })),
      setAccessToken: (token: string | null) =>
        set(() => ({ accessToken: token })),
      setTtubeotId: (ttubeotId: number) =>
        set(() => ({ ttubeotId: ttubeotId })),

      // 로그아웃 시 또는 필요할 때 사용자 정보 지우기
      clearUser: () =>
        set(() => ({
          user: {
            userId: '',
            userName: '',
            phoneNumber: '',
            userLocationAgreement: 0,
            userPushNotificationAgreement: 0, // 앱 푸시 알림 초기화
            userType: 0,
            goal: 0,
            coin: 0,
            userParent: 0,
          },
          ttubeotId: 0,
          isLoggedIn: false,
          accessToken: null,
        })),
    }),
    {
      name: 'user-storage', // AsyncStorage 키 이름
      storage: asyncStorageWrapper, // AsyncStorage 래퍼 사용
    },
  ),
);
