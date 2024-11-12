import { authRequest } from '../request';

export const updateStepMission = (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
  steps: number,
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const data = {
      steps,
    };
    const res = authClient.post('/user/auth/ttubeot/adventure/result', data);
    console.log(res.data);
  } catch (error) {
    console.log('updateMission Error', error);
  }
};
