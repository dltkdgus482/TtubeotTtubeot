import { authRequest } from '../request';

interface TtubeotGraduationInfo {
  ttubeotName: string;
  ttubeotScore: number;
  breakUp: string | null;
  createdAt: string;
  ttubeotId: number;
  ttubeotStatus: number; // 0: 현재 보유 중, 1: 졸업, 2: 안 뽑음
  adventureCount: number;
}

interface AlbumInfoResponse {
  find(arg0: (item: any) => boolean): unknown;
  ttubeotGraduationInfoDtoList: TtubeotGraduationInfo[];
}

// 졸업 앨범 목록
export const getAlbumInfoApi = async (
  accessToken: string,
  setAccessToken: (newToken: string) => void,
): Promise<AlbumInfoResponse | null> => {
  const authClient = authRequest(accessToken, setAccessToken);

  if (!authClient) {
    console.warn('유효하지 않은 accessToken입니다.');
    return null;
  }

  try {
    const response = await authClient.get<AlbumInfoResponse>(
      '/user/auth/ttubeot/graduation-info',
    );
    console.log('앨범 정봌ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ', response.data);
    return response.data;
  } catch (error) {
    console.error('앨범 정보를 불러올 수 없습니다.', error);
    throw new Error('앨범 정보를 불러올 수 없습니다.');
  }
};
