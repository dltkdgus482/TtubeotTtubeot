import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';

interface DrawTtubeotProps {
  userTtubeotOwnershipId: number;
  ttubeotId: number;
}

interface ConfirmTtubeotNameProps {
  userTtubeotOwnershipId: number;
  userTtubeotOwnershipName: string;
}

export const drawTtubeot = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
  type: number,
  ttubeotId?: number | null,
  grade?: number | null,
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const data = {
      type: 1,
      // type,
      // ttubeotId,
      // grade,
    };
    // console.log(data);
    const res = await authClient.post('/user/auth/ttubeot/draw', data);

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('drawTtubeot Error', error);
    return false;
  }
};

export const confirmTtubeotName = async (
  userTtubeotOwnershipId: number,
  userTtubeotOwnershipName: string,
) => {
  console.log(
    'confirmTtubeotName',
    userTtubeotOwnershipId,
    userTtubeotOwnershipName,
  );

  try {
    const data = {
      userTtubeotOwnershipId,
      userTtubeotOwnershipName,
    };

    const res = await defaultRequest.post('/user/ttubeot/name', data);

    console.log(res.data);
    return true;
  } catch (error) {
    console.log('confirmTtubeotName Error', error);
    return false;
  }
};
