import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';

interface DailyMissionProps {
  mission: string;
}

interface WeeklyMissionProps {
  mission: string;
}

export const getDailyMissionList = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<DailyMissionProps[]> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/auth/ttubeot/daily');

    console.log(res.data);
    return res.data;
  } catch (error) {
    if (error.response.status === 403) {
      console.log(error);
      return [];
    } else {
      console.log(error);
      return [];
    }
  }
};

export const getWeeklyMissionList = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<WeeklyMissionProps[]> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/auth/ttubeot/weekly');

    console.log(res.data);
    return res.data;
  } catch (error) {
    if (error.response.status === 403) {
      console.log(error);
      return [];
    } else {
      console.log(error);
      return [];
    }
  }
};
