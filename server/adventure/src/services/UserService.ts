class UserService {

  private readonly baseUrl = 'user.ttubeot-user.svc.cluster.local';

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

}

export default UserService;