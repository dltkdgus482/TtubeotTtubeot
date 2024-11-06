import { defaultRequest } from '../request';

export const getUsername = async (opponentUserId: number): Promise<string> => {
  try {
    const res = await defaultRequest(`/user/other-profile/${opponentUserId}`);
    return res.data.username;
  } catch (error) {
    console.log(error);
    return '';
  }
};
