import { Socket } from 'socket.io-client';

interface PositionData {
  lat: number;
  lng: number;
  steps: number;
}

class AdventureManager {
  private static instance: AdventureManager;
  private socket: Socket;

  private constructor(socket: Socket) {
    this.socket = socket;

    // 모험 일지를 수신하면 연결 해제
    this.socket.on('adventure_result', data => {
      console.log('모험 일지를 수신했습니다. 모험을 종료합니다. ', data);
    });

    this.socket.on('adventure_park', data => {
      console.log('공원 정보를 수신했습니다', data);
    });
  }

  static initialize(socket: Socket) {
    if (!AdventureManager.instance) {
      AdventureManager.instance = new AdventureManager(socket);
    }
    return AdventureManager.instance;
  }

  static getInstance(): AdventureManager {
    if (!AdventureManager.instance) {
      throw new Error('AdventureManager is not initialized.');
    }
    return AdventureManager.instance;
  }

  static destory() {
    if (AdventureManager.instance) {
      AdventureManager.instance = null;
    }
  }

  // 위치 정보 전송 메서드
  sendPosition(data: PositionData) {
    this.socket.emit('adventure_info', data);
    console.log('adventure_info event를 전송합니다. ', data);
  }

  // 모험 종료 알림 전송 메서드
  endAdventure() {
    this.socket.emit('adventure_end');
    console.log('adventure_end event 전송');
  }
}

export default AdventureManager;
