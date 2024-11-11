import { useId } from 'react';
import { authRequest } from '../request';
import { TtubeotData } from '../../../types/ttubeotData';

interface GetUserTtubeotIdProps {
  user_ttubeot_ownership_id: number;
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
    console.log('응답!!!!!!!!!!!', res.data);
    return res.data;
  } catch (err) {
    console.log('에러!!!!!!!!!!!!!!!!', err);
    return null;
  }
};
