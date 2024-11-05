import dotenv from 'dotenv';

dotenv.config();
class UserService {

  private readonly baseUrl = 'user.ttubeot-user.svc.cluster.local:8080';
  private secretKey: string = process.env.DEV_SECRET_KEY || '';

  async getUserTtubeot(userId: number): Promise<number> {
    let response = await fetch(`http://${this.baseUrl}/user/ttubeot/adventure/${userId}/id`);
    let result = await response.json();

    return result.userTtubeotId;
  }

  async getUserInfo(userId: number): Promise<{ username: string, ttubeot_id: number }> {
    let response = await fetch(`http://${this.baseUrl}/other-profile/${userId}`);
    let result = await response.json();

    return { username: result.username, ttubeot_id: result.ttubeot_id };
  }

  async checkFriendship(userId: number, friendId: number): Promise<boolean> {
    let requestBody = { userId, friendId };
    let response = await fetch(`http://${this.baseUrl}/user/friend/check-friend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    return response.status === 200;
  }

  async tagFriend(userId: number, friendId: number): Promise<number> {
    let requestBody = { userId, friendId };
    let response = await fetch(`http://${this.baseUrl}/user/friend/tag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    let result = await response.json();

    return result.coin || 0;
  }

  async postAdventureCoin(userId: number, coin: number): Promise<void> {
    let requestBody = { userId, coin };
    await fetch(`http://${this.baseUrl}/user/adventure-coin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Secret-Key": this.secretKey },
      body: JSON.stringify(requestBody)
    });
  }
}

export default UserService;