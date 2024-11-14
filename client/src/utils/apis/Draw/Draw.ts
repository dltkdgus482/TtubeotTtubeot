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
  type: number, // 뽑기 타입 -> 랜덤 - 1, 확정 - 2, 등급 - 3
  price: number,
  ttubeotId?: number | null, // 선택된 뚜벗 ID (type이 확정일 경우에만 보냄 / 랜덤, 등급일경우 필요 없음)
  grade?: number | null, // type이 등급일 때만 보냄
) => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const data = {
      type,
      price,
      ttubeotId,
      grade,
    };
    // console.log(data);
    const res = await authClient.post('/user/auth/ttubeot/draw', data);

    console.log('뚜벗 뽑기', res.data);
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

interface BreakUpTtubeotInfoResponse {
  ttubeotId?: number; // 뚜벗 타입
  userTtubeotOwnershipId?: number; // 사용자 뚜벗의 아이디
  graduationStatus?: number; // 어떻게 헤어졌는지 (정상 졸업 or 중퇴)
  breakUp?: string; // 언제 헤어졌는지 (LocalDateTime as ISO string)
  message?: string; // 204 응답 시에만 포함되는 메시지
}

// 최근 헤어진 뚜벗 정보
export const getBreakUpTtubeotInfoApi = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<BreakUpTtubeotInfoResponse | null | false> => {
  const authClient = authRequest(accessToken, setAccessToken);

  if (!authClient) {
    console.warn('유효하지 않은 accessToken입니다.');
    return null;
  }

  try {
    const response = await authClient.get<BreakUpTtubeotInfoResponse>(
      '/user/auth/ttubeot/recent-breakup',
    );

    if (response.status === 204) {
      return null;
    }

    console.log('최근 헤어진 뚜벗 정보', response.data);
    return response.data;
  } catch (error) {
    console.error('getBreakUpTtubeotInfo Error', error);
    return false;
  }
};
