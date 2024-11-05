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
      console.log('Received message:', msg);

      switch (msg.type) {
        case 'adventure_reward':
          this.handleReward(msg);
          break;
        case 'adventure_request':
          this.handleRequest(msg);
          break;
        default:
          console.error('Invalid message type:', msg.type);
      }
    });
  }

  async handleReward(msg: any) {
    console.log('Handling reward:', msg);
    let user_id = msg.data.user_id;

    let socket = this.userMap.get(user_id);
    if (socket) {
      socket.emit('adventure_reward', msg.data.data);
      await this.mqService.check(msg);
    }
  }

  async handleRequest(msg: any) {
    console.log('Handling request:', msg);
    let user_id = msg.data.user_id;
    let socket = this.userMap.get(user_id);

    if (socket) {
      socket.emit('adventure_request', msg.data.data);
      await this.mqService.check(msg);
    }
  }
}

export default MQController;