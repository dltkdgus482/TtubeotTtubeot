import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';

// 비밀번호 재설정 api
// request header
// {
// 	"Authorization": Bearer `{accessToken}`,
// }
// request body
// {
// 	"phone": "01012341234",
// 	"password": "얄리얄리얄량셩",
// }
export const changePasswordApi = async (phone, password, accessToken, setAccessToken) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    if (!authClient) {
      Alert.alert('유효하지 않은 accessToken입니다.');
      return false;
    }

    const response = await authClient.patch('/user/change-password', {
      phone,
      password,
    });

    if (response.status === 200) {
      Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
      return true;
    } else {
      Alert.alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  } catch (error) {
    console.log(error);
    Alert.alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    return false;
  }
};


