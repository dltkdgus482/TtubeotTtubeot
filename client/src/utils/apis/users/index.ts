import { defaultRequest, authRequest } from '../request';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {SERVER_URL} from '@env'

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
  console.log(SERVER_URL)
  // 요청 전 폼 데이터 확인
  console.log('[+] Sending login request with data:', formData);
  if (!formData.id || !formData.password) {
    Alert.alert('아이디와 비밀번호를 입력해주세요.');
    return false;
  }
  try {
    console.log('[POST Request to]:', `${SERVER_URL}/user/login`);
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
        // Alert.alert('로그인에 성공했습니다.'); // todo: 나중에 지워도 될 듯

        //fcm토큰 발급 후 백엔드로 post요청
        const fcmToken = await messaging().getToken();
        console.log('[+] FCM Token: ', fcmToken);

        // send FCM
        const response = await defaultRequest.post(
          '/user/admin/update-fcm-token',
          {userId, fcmToken},
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
  setIsLoggedIn(false);
  setAccessToken(null);
  // const authClient = authRequest(accessToken, setAccessToken);
  // // console.log('토큰', accessToken)
  // if (!authClient) {
  //   throw new Error('유효하지 않은 액세스 토큰입니다.');
  // }

  // try {
  //   const response = await authClient.post('/user/logout');

  //   if (response.status === 200) {
  //     setIsLoggedIn(false); // 로그아웃 상태 설정
  //   } else {
  //     throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
  //   }

  // } catch (error) {
  //   if (error.response) {
  //     switch (error.response.status) {
  //       case 400:
  //         throw new Error('잘못된 요청 방식입니다.');
  //       case 401:
  //         throw new Error('잘못된 인증 정보입니다.');
  //       case 405:
  //         throw new Error('잘못된 API 메소드입니다.');
  //       default:
  //         throw new Error(
  //           '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.',
  //         );
  //     }
  //   } else {
  //     throw new Error('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
  //   }
  // }
};

// 유저 정보 수정
// 요청 header
// {
// 	"Authorization": Bearer `{accessToken}`,
// }
// 요청 body
// {
// 	"user_location_agreement": ${위치정보제공동의 / tinyint},
// 	"user_parent": ${부모 유저 id / int}
// }
// 위 정보들은 다 있을 필요 없음(비번만 바꿀거면 비번만 담아서,,)
// - 유저 정보 리스트
// {
// 	"user_location_agreement": 1,
// 	"user_goal": 10000,
// 	"user_parent": 123,
// }
// Status Code
// 200	정상처리
// 400	잘못된 요청 방식
// 401	잘못된 인증 정보
// 405	잘못된 API Method
// response body
// {
// 	"message": ""
// }

// {
// 	"message": "사용자 검증에 실패했습니다."
// }
// export const modifyUserInfo = async (accessToken, setAccessToken) => {
//   try {
//     const authClient = authRequest(accessToken, setAccessToken);
//     if (!authClient) {
//       Alert.alert('유효하지 않은 accessToken입니다.');
//       return false;
//     }

//     const response = await authClient.patch('/user/me', {
//       // todo: 추가
//     });
//   } catch (error) {

//   }
// };

// 유저 정보 수정 API
export const modifyUserInfoApi = async (
  accessToken: string,
  setAccessToken: (newToken: string) => void,
  userData: {
    user_location_agreement?: number;
    user_goal?: number;
    user_parent?: number;
    password?: string;
  }
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
          Alert.alert('유저 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } else {
      Alert.alert('유저 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};

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
    console.log('getinfo', getInfoRes.data);
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
