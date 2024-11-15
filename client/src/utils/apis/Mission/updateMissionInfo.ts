import { authRequest } from '../request';

export const updateStepMission = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
  steps: number,
): Promise<void> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const data = {
      steps,
    };
    const res = await authClient.post(
      '/user/auth/ttubeot/adventure/result',
      data,
    );
    console.log('----- updatedMission -----', res.data);
  } catch (error) {
    console.log('updateMission Error', error);
  }
};
