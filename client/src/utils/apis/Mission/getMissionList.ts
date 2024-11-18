import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';

interface MissionProps {
  missionActionCount: number;
  missionExplanation: string;
  missionName: string;
  missionStatus: string;
  missionTargetCount: number;
  missionTheme: number;
  missionType: number;
}

export const getDailyMissionList = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/auth/ttubeot/daily');
    const resData = res.data;

    // console.log(resData);
    return [...resData.inProgressMissions, ...resData.completedMissions];
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
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get('/user/auth/ttubeot/weekly');
    const resData = res.data;

    // console.log(resData);

    return [...resData.inProgressMissions, ...resData.completedMissions];
  } catch (error) {
    if (error.response.status === 403) {
      // console.log(error);
      return [];
    } else {
      // console.log(error);
      return [];
    }
  }
};
