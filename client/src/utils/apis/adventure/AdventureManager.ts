import { Socket } from 'socket.io-client';

interface PositionData {
  lat: number;
  lng: number;
  steps: number;
}

interface UserProps {
  user_id: number;
  username: string;
  ttubeot_id: number;
  distance: number;
}

class AdventureManager {
  public static instance: AdventureManager;
  public socket: Socket;

  public constructor(socket: Socket) {
    this.socket = socket;

    // this.socket.on('adventure_result', data => {
    //   console.log('모험 일지를 수신했습니다. 모험을 종료합니다. ', data);
    // });

    // this.socket.on('adventure_park', data => {
    //   console.log('공원 정보를 수신했습니다', data);
    // });

    // this.socket.on('adventure_request', data => {
    //   console.log('친구 요청을 수신했습니다', data);
    // });

    // this.socket.on('adventure_confirm', data => {
    //   console.log('친구 요청 응답을 수신했습니다', data);
    // });
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

  public addAdventureResultListener(callback: (data) => void) {
    this.socket.on('adventure_result', callback);
  }

  public addAdventureUserListener(callback: (data: UserProps[]) => void) {
    this.socket.on('adventure_user', callback);
  }

  public addAdventureParkListener(callback: (data) => void) {
    this.socket.on('adventure_park', callback);
  }

  public addAdventureRequestListener(callback: (data) => void) {
    this.socket.on('adventure_request', callback);
  }

  public addAdventureConfirmListener(callback: (data) => void) {
    this.socket.on('adventure_confirm', callback);
  }

  // 위치 정보 전송 메서드
  public sendPosition(data: PositionData) {
    this.socket.emit('adventure_info', data);
    console.log('adventure_info event를 전송합니다. ', data);
  }

  // 모험 종료 알림 전송 메서드
  public endAdventure() {
    this.socket.emit('adventure_end');
    console.log('adventure_end event 전송');
  }
}

export default AdventureManager;
