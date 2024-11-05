import MQService from '../services/MQService';
import UserService from '../services/UserService';
import { Socket } from 'socket.io';

class MQController {
  private mqService: MQService;
  private userService: UserService;
  private userMap: Map<number, Socket>;

  constructor(userMap: Map<number, Socket>) {
    this.mqService = new MQService('adventure');
    this.userService = new UserService();
    this.userMap = userMap;

    this.mqService.init().then(() => {
      this.handleEvents();
    });
  }


  handleEvents() {
    this.mqService.subscribe('adventure', (msg) => {
      console.log('Received message:', msg.content);

      switch (msg.content.type) {
        case 'adventure_reward':
          this.handleReward(msg);
          break;
        case 'adventure_request':
          this.handleRequest(msg);
          break;
        default:
          console.error('Invalid message type:', msg.content.type);
      }
    });
  }

  async handleReward(msg: any) {
    console.log('Handling reward:', msg.content);
    let user_id = msg.content.data.user_id;

    let socket = this.userMap.get(user_id);
    if (socket) {
      socket.emit('adventure_reward', msg.content.data.data);
      await this.mqService.check(msg.originalMsg);  // 원본 msg 전달
    }
  }

  async handleRequest(msg: any) {
    console.log('Handling request:', msg.content);
    let user_id = msg.content.data.user_id;
    let socket = this.userMap.get(user_id);

    if (socket) {
      socket.emit('adventure_request', msg.content.data.data);
      await this.mqService.check(msg.originalMsg);  // 원본 msg 전달
    }
  }
}

export default MQController;