import { defaultRequest } from '../request';
import { Alert } from 'react-native';

// 비밀번호 재설정
export const changePasswordApi = async (phone: string, password: string) => {
  try {
    const response = await defaultRequest.patch('/user/change-password', {
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
