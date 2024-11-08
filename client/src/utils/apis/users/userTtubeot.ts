import { authRequest } from '../request';

interface GetUserTtubeotIdProps {
  user_ttubeot_ownership_id: number;
}

interface GetUserTtubeotDetailProps {
  errorCode?: string;
  message?: string;
  ttubeot_type?: number;
  ttubeot_name?: string;
  ttubeot_score?: number;
  created_at?: string;
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
  userId: string,
  accessToken: string,
  setAccessToken: (accesstoken: string) => void,
): Promise<GetUserTtubeotDetailProps> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(
      `/user/ttubeot/adventure/${userId}/details`,
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
