import { authRequest, defaultRequest } from '../request';

interface RankingProps {
  user_id: number;
  username: string;
  score: number;
  ttubeot_id: number;
}

export const getRankingInfo = async (): Promise<RankingProps[]> => {
  try {
    const res = await defaultRequest.get('/user/ranking');
    return res.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
