class UserService {

  private readonly baseUrl = 'user.ttubeot-user.svc.cluster.local';

  async getUserTtubeot(userId: number): Promise<number> {
    let response = await fetch(`http://${this.baseUrl}/user/ttubeot/adventure/${userId}/id`);
    let result = await response.json();

    return result.userTtubeotId;
  }

}

export default UserService;