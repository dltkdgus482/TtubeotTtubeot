import { useId } from 'react';
import { authRequest } from '../request';
import { TtubeotData } from '../../../types/ttubeotData';

interface GetUserTtubeotIdProps {
  user_ttubeot_ownership_id: number;
}

interface TtubeotStatusResponse {
  ttubeotStatus: number;
  ttubeotStatusList?: {
    ttubeotStatusLog: {
      ttubeotLogType: number;
      createdAt: string;
    }[];
  };
}

interface TtubeotInterestInfoResponse {
  ttubeotInterest: number; // 관심지수
  currentTtubeotStatus: number; // 0 - 배고픔, 1 - 심심함, 2 - 평온
}

export const getUserTtubeotId = async (
  userId: string,
  accessToken: string,
  setAccessToken: (accesstoken: string) => void,
): Promise<GetUserTtubeotIdProps> => {
  const id = parseInt(userId, 10);
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(`/user/ttubeot/adventure/${id}/id`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { user_ttubeot_ownership_id: 0 };
  }
};

export const getTtubeotDetail = async (
  userId: number,
  accessToken: string,
  setAccessToken: (accesstoken: string) => void,
): Promise<TtubeotData> => {
  if (!userId) {
    return;
  }
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(
      `/user/ttubeot/adventure/${userId}/details`,
    );
    // console.log('응답!!!!!!!!!!!', res.data);
    return res.data;
  } catch (err) {
    console.log('뚜벗 상세 정보 불러오기 실패:', err);
    return null;
  }
};

// [GET] '/user/auth/ttubeot/status'
// 뚜벗 상태 조회 api

export const getTtubeotStatus = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<TtubeotStatusResponse | null> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/auth/ttubeot/status');
    console.log('뚜벗 상태 조회 성공:', res.data);
    return res.data;
  } catch (err) {
    console.error('뚜벗 상태 조회 오류:', err);
    return null;
  }
};

// [GET] '/user/auth/ttubeot/interest'
// 뚜벗의 관심도 조회

export const getTtubeotInterestApi = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<TtubeotInterestInfoResponse> => {
  const authClient = authRequest(accessToken, setAccessToken);
  if (!authClient) {
    console.warn('유효하지 않은 accessToken입니다.');
    return null;
  }

  try {
    const response = await authClient.get('/user/auth/ttubeot/interest');
    console.log('뚜벗 관심도:', response.data);
    return response.data;
  } catch (err) {
    console.error('뚜벗 관심도 조회 오류:', err);
    return null;
  }
};
