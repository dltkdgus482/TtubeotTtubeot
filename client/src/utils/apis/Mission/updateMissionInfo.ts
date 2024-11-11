import { authRequest } from '../request';

export const updateMission = (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    // const res = authClient.post();
    // console.log(res.data);
  } catch (error) {
    console.log('updateMission Error', error);
  }
};
