import { authRequest, defaultRequest } from '../request';

interface TtubeotProps {
  ttubeot_type: number;
  ttubeot_image: any;
  create_at: string;
  ttubeot_score: number;
  ttubeot_name: string;
}

interface FriendProps {
  user_id: number;
  username: string;
  user_walk: number | null;
  user_ttubeot: TtubeotProps | null;
}

export const getFriendList = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<FriendProps[]> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/friend/info-list');

    return res.data;
  } catch (error) {
    console.log('getFriendList Error', error);
    return [];
  }
};

export const removeFriend = async (
  userId: number,
  friendId: number,
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<boolean> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.delete(`/user/friend/${userId}/${friendId}`);
    return true;
  } catch (error) {
    console.log('removeFriend Error', error);
    return false;
  }
};

export const isFriend = async (
  userId: number,
  friendId: number,
): Promise<boolean> => {
  try {
    const res = await defaultRequest(
      `/user/friend/check-friend/${userId}/${friendId}`,
    );

    if (res.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    if (error.response.status === 404) {
      console.log('친구가 아닙니다.');
    } else {
      console.log('isFriend Error', error);
    }
    return false;
  }
};
