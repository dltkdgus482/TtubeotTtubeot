import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { SERVER_URL } from '@env';
import { useUser } from '../../store/user';

// 공통 Axios 인스턴스 생성 함수
const createAxiosInstance = () => {
  return axios.create({
    baseURL: SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

// Interceptor 설정
export const setupInterceptors = (
  axiosInstance,
  accessToken,
  setAccessToken,
) => {
  const { clearUser } = useUser.getState();

  axiosInstance.interceptors.request.use(async config => {
    if (accessToken && typeof accessToken === 'string') {
      try {
        const { exp } = jwtDecode(accessToken);
        // 토큰 만료 확인 후 갱신
        if (exp && Date.now() >= exp * 1000) {
          try {
            const newToken = await getNewToken();
            setAccessToken(newToken);
            console.log('newToken', newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
          } catch (error) {
            console.error('토큰 갱신 중 오류 발생:', error);
            clearUser(); // 토큰 갱신 실패 시 사용자 정보 초기화
            throw error;
          }
        } else {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('토큰 디코딩 중 오류 발생:', error);
        clearUser(); // 디코딩 실패 시 사용자 정보 초기화
        throw error;
      }
    } else {
      console.warn('유효하지 않은 액세스 토큰입니다.');
      clearUser(); // 유효하지 않은 토큰일 때도 초기화
    }

    return config;
  });

  // 응답 에러 처리
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      console.log('API 요청 오류:', error);
      return Promise.reject(error);
    },
  );
};

// 새로운 토큰 가져오는 함수
export const getNewToken = async () => {
  const { clearUser } = useUser.getState();

  try {
    const res = await defaultRequest.post('/user/reissue');
    console.log('res', res);
    const authorizationHeader = res.headers.authorization;
    const accessToken = authorizationHeader
      ? authorizationHeader.replace(/^Bearer\s+/i, '')
      : null;
    return accessToken;
  } catch (error) {
    console.error('토큰 갱신 중 오류 발생:', error);
    clearUser();
    throw error;
  }
};

// 인증이 필요한 요청 클라이언트 생성 함수
export const authRequest = (accessToken, setAccessToken) => {
  const { clearUser } = useUser.getState();

  // accessToken 유효성 검사
  console.log('access token: ' + accessToken);
  if (!accessToken || typeof accessToken !== 'string') {
    console.warn('유효하지 않은 accessToken입니다.');
    clearUser();
    return null;
  }

  const authClient = createAxiosInstance();
  setupInterceptors(authClient, accessToken, setAccessToken);
  return authClient;
};

// 인증이 필요 없는 기본 요청 클라이언트
export const defaultRequest = createAxiosInstance();
