import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// [POST] '/user/login'
// 로그인
export const loginApi = async (formData, setAccessToken, setIsLoggedIn) => {
  if (!formData.id || !formData.password) {
    Alert.alert('아이디와 비밀번호를 입력해주세요.');
    return false;
  }

  try {
    const loginRes = await defaultRequest.post('/user/login', {
      user_phone: formData.id,
      password: formData.password,
    });

    // 응답 성공 로그
    console.log('[Response Status]:', loginRes.status);
    console.log('[Response Headers]:', loginRes.headers);
    console.log('[Response Data]:', loginRes.data);
    if (loginRes.status === 200) {
      const userId = loginRes.data.userId;
      const authorizationHeader = loginRes.headers.authorization;
      const accessToken = authorizationHeader
        ? authorizationHeader.replace(/^Bearer\s+/i, '')
        : null;

      if (accessToken) {
        setAccessToken(accessToken); // 유저 액세스 토큰 저장
        setIsLoggedIn(true); // 로그인 상태 설정

        //fcm토큰 발급 후 백엔드로 post요청
        const fcmToken = await messaging().getToken();
        console.log('[+] FCM Token: ', fcmToken);

        // send FCM
        const response = await defaultRequest.post(
          '/user/admin/update-fcm-token',
          { userId, fcmToken },
        );

        console.log('[+] FCM Token 전송 성공:', response.data);
        return loginRes.data.userId; // 로그인된 사용자 ID 반환
      } else {
        Alert.alert('토큰이 존재하지 않습니다.');
        throw new Error('토큰이 존재하지 않습니다.');
      }
    } else {
      Alert.alert('로그인에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          Alert.alert('잘못된 요청 방식입니다.');
          break;
        case 401:
          Alert.alert('잘못된 로그인 정보이거나 이미 삭제된 계정입니다.');
          break;
        case 403:
          Alert.alert('부모 계정으로는 로그인할 수 없습니다.');
          break;
        case 405:
          Alert.alert('잘못된 API 메소드입니다.');
          break;
        default:
          Alert.alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
          break;
      }
    } else {
      Alert.alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    console.error('로그인 요청 중 오류 발생:', error.message);
    return false;
  }
};

// [POST] '/user/logout'
// 로그아웃
export const logoutApi = async (userPhone: string) => {
  try {
    const response = await defaultRequest.post('/user/logout', {
      userPhone: userPhone,
    });
    if (response.status === 200) {
      return true;
    } else {
      throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('잘못된 요청 방식입니다.');
        case 401:
          throw new Error('잘못된 인증 정보입니다.');
        case 405:
          throw new Error('잘못된 API 메소드입니다.');
        default:
          throw new Error(
            '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.',
          );
      }
    } else {
      throw new Error('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }
};

// [patch] '/user/me'
// 유저 정보 수정
export const modifyUserInfoApi = async (
  accessToken: string,
  setAccessToken: (newToken: string) => void,
  userData: {
    user_location_agreement?: number;
    user_goal?: number;
    user_parent?: number;
    password?: string;
  },
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    if (!authClient) {
      Alert.alert('유효하지 않은 accessToken입니다.');
      return false;
    }

    const response = await authClient.patch('/user/me', userData);

    if (response.status === 200) {
      return true;
    } else {
      Alert.alert('유저 정보 수정에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  } catch (error) {
    console.error('유저 정보 수정 실패:', error);
    if (error.response) {
      switch (error.response.status) {
        case 400:
          Alert.alert('잘못된 요청 방식입니다.');
          break;
        case 401:
          Alert.alert('잘못된 인증 정보입니다. 다시 로그인해주세요.');
          break;
        case 405:
          Alert.alert('잘못된 API 메소드입니다.');
          break;
        default:
          Alert.alert(
            '유저 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.',
          );
      }
    } else {
      Alert.alert('유저 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};

// [get] '/user/profile'
// 프로필 정보 조회
export const getInfoApi = async (accessToken, setAccessToken) => {
  const authClient = authRequest(accessToken, setAccessToken);

  try {
    const getInfoRes = await authClient.get('/user/profile');
    console.log('유저 정보 조회', getInfoRes.data);
    return getInfoRes.data;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw error;
  }
};

// [delete] '/user/me'
// 회원 탈퇴
export const deleteUserApi = async (accessToken, setAccessToken) => {
  const authClient = authRequest(accessToken, setAccessToken);

  try {
    const deleteUserRes = await authClient.delete('/user/me');
    return true;
  } catch (error) {
    console.error('회원 탈퇴 실패:', error);
    return false;
  }
};
