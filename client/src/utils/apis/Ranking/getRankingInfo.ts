import { authRequest, defaultRequest } from '../request';

interface RankingProps {
  user_id: number;
  username: string;
  score: number;
  ttubeot_id: number;
}

export const getRankingInfo = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<RankingProps[]> => {
  try {
    // const authClient = authRequest(accessToken, setAccessToken);
    const res = await defaultRequest.get('/user/ranking');
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
