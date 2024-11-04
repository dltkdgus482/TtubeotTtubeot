import { useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from '../../../store/user';
import { authRequest } from '../../apis/request';
import AdventureManager from './AdventureManager';

const SOCKET_SERVER_URL = 'https://ssafy.picel.net';
const SOCKET_PATH = '/adventure/socket.io';

interface InitMessage {
  token: string;
}

const useAdventureSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, setAccessToken } = useUser();

  const connectSocket = useCallback(async () => {
    const authClient = authRequest(accessToken, setAccessToken);
    if (!authClient) {
      console.error('유효한 토큰이 없어 소켓을 연결할 수 없습니다.');
      return;
    }

    const updatedToken = `Bearer ${accessToken}`;

    socketRef.current = io(SOCKET_SERVER_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      const initMessage: InitMessage = { token: updatedToken };
      socketRef.current?.emit('adventure_init', initMessage);
      console.log('소켓 연결 수립 및 adventure_init 이벤트 전송:', initMessage);

      // AdventureManager 초기화 및 소켓 인스턴스 전달
      AdventureManager.initialize(socketRef.current!);
    });
  }, [accessToken, setAccessToken]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log('소켓 연결이 종료되었습니다.');
      socketRef.current = null;
    }
  }, []);

  return { connectSocket, disconnectSocket };
};

export default useAdventureSocket;