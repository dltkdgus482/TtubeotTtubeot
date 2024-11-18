// gps정보와 걸음 수 정보를 제공합니다.
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://ssafy.picel.net';
const SOCKET_PATH = '/adventure/socket.io';

interface PositionData {
  lat: number;
  lng: number;
  steps: number;
}

class AdventureInfo {
  private static instance: AdventureInfo; // 싱글턴 인스턴스
  private socket: Socket;

  constructor() {
    this.socket = io(SOCKET_SERVER_URL, {
      path: SOCKET_PATH,
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      // console.log('사용자 위치 정보와 걸음수를 실시간으로 전송하겠습니다.');
    });
  }

  // 싱글턴 인스턴스를 반환하는 메서드
  static getInstance(): AdventureInfo {
    if (!AdventureInfo.instance) {
      AdventureInfo.instance = new AdventureInfo();
    }
    return AdventureInfo.instance;
  }

  sendPosition(data: PositionData) {
    this.socket.emit('adventure_info', data);
    // console.log('adventure_info event 전송: ', data);
  }
}

export default AdventureInfo;
