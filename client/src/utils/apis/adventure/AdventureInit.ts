import { useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUser } from '../../../store/user';
import { authRequest, getNewToken } from '../../apis/request';
import AdventureManager from './AdventureManager';
import { update } from 'three/examples/jsm/libs/tween.module.js';
import useAdventureStore from '../../../store/adventure';

const SOCKET_SERVER_URL = 'https://ssafy.picel.net';
const SOCKET_PATH = '/adventure/socket.io';

interface InitMessage {
  token: string;
}

const useAdventureSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, setAccessToken } = useUser.getState();
  const { setSocketConnected } = useAdventureStore();

  const connectSocket = useCallback(async () => {
    if (socketRef.current !== null) {
      console.error('이미 소켓이 연결되어 있습니다.');
      return;
    }

    const updatedToken = await getNewToken();
    setAccessToken(updatedToken);

    socketRef.current = io(SOCKET_SERVER_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
    });

    console.log('토큰 최신화 로직이 실행됐습니다!');

    socketRef.current.on('connect', () => {
      const initMessage: InitMessage = { token: `Bearer ${accessToken}` };
      socketRef.current?.emit('adventure_init', initMessage);
      console.log('소켓 연결 수립 및 adventure_init 이벤트 전송:', initMessage);
      setSocketConnected(true);
      // AdventureManager 초기화 및 소켓 인스턴스 전달
      AdventureManager.initialize(socketRef.current!);
    });
  }, [accessToken]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('adventure_end');
      console.log('adventure_end 이벤트 전송');
      socketRef.current.on('adventure_result', data => {
        console.log('adventure_result 이벤트 수신:', data);

        socketRef.current?.disconnect();
        setSocketConnected(false);
        console.log('소켓 연결이 종료되었습니다.');
        AdventureManager.destory();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      });
    }
  }, []);

  return { connectSocket, disconnectSocket };
};

export default useAdventureSocket;
