import path from "path";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

class WeatherService {
  private static pytCode: { [key: number]: string } = {
    0: "강수 없음",
    1: "비",
    2: "비/눈",
    3: "눈",
    5: "빗방울",
    6: "진눈깨비",
    7: "눈날림",
  };

  private static skyCode: { [key: number]: string } = {
    1: "맑음",
    3: "구름많음",
    4: "흐림",
  };

  private async loadGridData(): Promise<any[]> {
    // 루트 경로에 있는 grid_data.json 파일 경로 설정
    const filePath = path.join(__dirname, "../../grid_data.json");

    // 파일이 존재하는지 확인 후 읽기
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  }

  public async findNearestGrid(
    lat: number,
    lon: number
  ): Promise<{ x: number; y: number } | null> {
    const gridData = (await this.loadGridData()) || []; // gridData가 null일 경우 빈 배열로 설정
    let closestGrid = null;
    let smallestDistance = Infinity;

    gridData.forEach((grid) => {
      const distance = Math.sqrt(
        Math.pow(grid.latitude - lat, 2) + Math.pow(grid.longitude - lon, 2)
      );

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestGrid = { x: grid.x, y: grid.y };
      }
    });

    // gridData가 빈 배열이면 기본값 설정
    if (closestGrid === null) {
      closestGrid = { x: 60, y: 127 };
    }

    console.log("Nearest Grid:", closestGrid);
    return closestGrid;
  }

  private summarizeWeatherData(items: any[]): string {
    let totalTemp = 0;
    let totalHumidity = 0;
    let count = 0;
    const skyFrequency: { [key: string]: number } = {};
    const precipitationTypes = new Set<string>();

    items.forEach((item) => {
      const { category, fcstValue } = item;

      switch (category) {
        case "T1H":
          totalTemp += parseFloat(fcstValue);
          count++;
          break;
        case "REH":
          totalHumidity += parseFloat(fcstValue);
          break;
        case "SKY":
          skyFrequency[fcstValue] = (skyFrequency[fcstValue] || 0) + 1;
          break;
        case "PTY":
          if (fcstValue !== "0") {
            precipitationTypes.add(fcstValue);
          }
          break;
      }
    });

    const avgTemp = (totalTemp / count).toFixed(1);
    const avgHumidity = (totalHumidity / count).toFixed(1);

    const mostFrequentSky = Object.keys(skyFrequency).reduce((a, b) =>
      skyFrequency[a] > skyFrequency[b] ? a : b
    );

    const precipitationSummary =
      Array.from(precipitationTypes)
        .map((type) => WeatherService.pytCode[parseInt(type)])
        .join(", ") || "강수 없음";

    return `평균 기온: ${avgTemp}℃, 평균 습도: ${avgHumidity}%, 하늘 상태: ${
      WeatherService.skyCode[parseInt(mostFrequentSky)]
    }, 강수: ${precipitationSummary}`;
  }

  // 낮/밤 상태 결정 함수
  private getSunStatus(time: string): string {
    const hour = parseInt(time.slice(0, 2), 10);
    return hour >= 6 && hour < 18 ? "낮" : "밤";
  }

  private getSeason(date: string): string {
    const month = parseInt(date.slice(4, 6), 10);
    switch (true) {
      case month >= 3 && month <= 5:
        return "봄";
      case month >= 6 && month <= 8:
        return "여름";
      case month >= 9 && month <= 11:
        return "가을";
      default:
        return "겨울";
    }
  }

  public async requestWeatherInfo(
    lat: number,
    lon: number,
    date: string,
    time: string
  ): Promise<string> {
    try {
      const nearestGrid = await this.findNearestGrid(lat, lon);
      if (!nearestGrid) {
        throw new Error("Nearest grid not found");
      }

      const { x, y } = nearestGrid;

      const weatherUrl =
        "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst";
      const weatherParams = {
        serviceKey: process.env.WEATHER_API_KEY as string,
        pageNo: "1",
        numOfRows: "100",
        dataType: "JSON",
        base_date: date,
        base_time: time,
        nx: x,
        ny: y,
      };

      const weatherResponse = await axios.get(weatherUrl, {
        params: weatherParams,
      });
      const items = weatherResponse.data.response.body.items.item;
      const weatherSummary = this.summarizeWeatherData(items);

      const sunStatus = this.getSunStatus(time);
      const season = this.getSeason(date);

      console.log(
        "기상, 날씨 정보 생성 완료: ",
        `계절: ${season}, ${weatherSummary}, 시간대: ${sunStatus}`
      );

      return `계절: ${season}, ${weatherSummary}, 시간대: ${sunStatus}`;
    } catch (error) {
      console.error("Error fetching weather information:", error);
      return "정보 없음";
    }
  }
}

export default WeatherService;
