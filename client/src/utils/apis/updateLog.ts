// - 0 : 밥 주기
// - 1 : 친구 상호작용
// - 2 : 모험
// - 3 : 쓰다듬기

import { authRequest } from './request';

export const updateLog = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
  ttubeotLogType: number,
): Promise<void> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const updateLogRes = await authClient.post(
      '/user/auth/ttubeot/logs',
      ttubeotLogType,
    );
    console.log('updateLog', updateLogRes.data);
  } catch (error) {
    console.log(error);
  }
};
