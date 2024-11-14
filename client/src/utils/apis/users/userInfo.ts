import { defaultRequest, authRequest } from '../request';

interface GetUserInfoParams {
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
  userId: number;
}

interface GetUserInfoReturns {
  username: string;
  ttubeot_id: number;
}

interface GetTtuebeotInfoReturns {
  ttubeotType: number;
  ttubeotName: string;
  ttubeotImage: string;
  ttubeotScore: number;
  createAt: string;
}

// 사용자 이름, 뚜벗 아이디 조회
export const getUserInfo = async ({
  accessToken,
  setAccessToken,
  userId,
}: GetUserInfoParams): Promise<GetUserInfoReturns> => {
  try {
    const userInfo = await defaultRequest.get(`/user/other-profile/${userId}`);
    return userInfo.data;
  } catch (error) {
    console.log('getUserInfo Error', error);
  }
};

// 뚜벗 상세정보 조회
export const getTtubeotInfo = async ({
  accessToken,
  setAccessToken,
  userId,
}: GetUserInfoParams): Promise<GetTtuebeotInfoReturns> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const ttubeotInfo = await authClient.get(
      `/user/ttubeot/adventure/${userId}/details`,
    );
    console.log('getTtubeotInfo', ttubeotInfo.data);
    return ttubeotInfo.data;
  } catch (error) {
    console.log('getTtubeotInfo Error', error);
  }
};
