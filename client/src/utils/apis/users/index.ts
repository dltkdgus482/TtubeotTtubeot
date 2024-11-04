import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';

// [POST] '/user/login'
// 로그인
// request body
// {
// 	"user_phone" : String,
// 	"password" : String,
// }

// response
// - Header (StatusCode가 200인 경우에만)
// Authorization: `Bearer: ${access_token}`
// Set-Cookie: `refresh token: ${refresh_token}`
// - body
// {
// 	"message": "",
// 	"userId": 1
// }
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

    if (loginRes.status === 200) {
      const authorizationHeader = loginRes.headers.authorization;
      const accessToken = authorizationHeader
        ? authorizationHeader.replace(/^Bearer\s+/i, '')
        : null;

      if (accessToken) {
        setAccessToken(accessToken); // 유저 액세스 토큰 저장
        setIsLoggedIn(true); // 로그인 상태 설정
        Alert.alert('로그인에 성공했습니다.');
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
    console.error('로그인 요청 중 오류 발생:', error);
    return false;
  }
};

// 로그아웃
// 요청 Header
// {
// 	"Authorization": Bearer `{accessToken}`,
// }
// response
// Status Code
// 200	정상처리
// 400	잘못된 요청 방식
// 401	잘못된 인증 정보
// 405	잘못된 API Method
// response
// 성공
// {
// 	"message": ""
// }
// 실패
// {
// 	"message": "사용자 검증에 실패했습니다."
// }
export const logoutApi = async (accessToken, setAccessToken, setIsLoggedIn) => {
  // 인증된 요청 클라이언트 생성
  const authClient = authRequest(accessToken, setAccessToken);

  if (!authClient) {
    throw new Error('유효하지 않은 액세스 토큰입니다. 다시 로그인해주세요.');
  }

  try {
    const response = await authClient.post('/user/logout');

    if (response.status === 200) {
      setIsLoggedIn(false); // 로그아웃 상태 설정
    } else {
      throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('잘못된 요청 방식입니다.');
        case 401:
          throw new Error('잘못된 인증 정보입니다. 다시 로그인해주세요.');
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

// 유저 정보 수정
export const modifyUserInfo = async () => {};

// Header
// {
// 	"Authorization": Bearer `{accessToken}`,
// }

// response
// {
// 	"user_name": "asdfasdsfa",
// 	"user_phone": "01084964116",
// 	"user_location_agreement": 1,
// 	"user_goal": 10000,
// 	"user_coin": 100,
// 	"user_parent": 123,
// }
// 프로필 정보 조회
export const getInfoApi = async (accessToken, setAccessToken) => {
  const authClient = authRequest(accessToken, setAccessToken);

  try {
    const getInfoRes = await authClient.get('/user/profile');

    return getInfoRes.data;
  } catch (error) {
    console.error('프로필 정보 조회 실패:', error);
    throw error;
  }
};

// 회원 탈퇴
// 요청 Header
// {
// 	"Authorization": Bearer `{accessToken}`,
// }
// 응답 Status Code
// 200	정상처리
// 400	잘못된 요청 방식
// 401	잘못된 인증 정보
// 405	잘못된 API Method
// response body
// 성공 시
// {
// 	"message": ""
// }
// 실패 시
// {
// 	"message": "사용자 검증에 실패했습니다."
// }
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
