import dotenv from 'dotenv';

dotenv.config();

class RoadViewService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY as string;
  }

  public getStreetViewLink(
    lat: number,
    lng: number,
    heading: number = 0,
    pitch: number = 0,
    fov: number = 90,
    size: string = '360x640'
  ): string {
    const baseUrl = `/maps/api/streetview?location=${lat},${lng}&size=${size}&heading=${heading}&pitch=${pitch}&fov=${fov}&key=${this.apiKey}`;
    return `https://maps.googleapis.com${baseUrl}`;
  }

  public async checkStreetViewAvailability(lat: number, lng: number): Promise<boolean> {
    const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log("API 응답 오류:", response.status);
        return false;
      }

      const data = await response.json();
      if (data.status === "OK") {
        return true;
      } else if (data.status === "ZERO_RESULTS") {
        return false;
      } else {
        console.log("오류:", data.status);
        return false;
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      throw new Error("Street View API 호출에 실패했습니다.");
    }
  }
}

export default RoadViewService;