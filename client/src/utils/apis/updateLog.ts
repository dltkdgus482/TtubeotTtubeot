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
    if (error.response) {
      const { status } = error.response;
      const { message } = error.response.data;

      if (status === 400) {
        // 오늘의 밥 주기 완료
        console.log('updateLog 실패: ', message);
      } else if (status === 500) {
        console.log('updateLog 실패: ', message);
      } else {
        console.log(`updateLog 실패: 알 수 없는 오류, 상태 코드 ${status}`);
      }
    } else {
      console.log(error);
    }
  }
};
