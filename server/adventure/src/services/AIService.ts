import dotenv from "dotenv";
import MonsterApiClient from "monsterapi";

dotenv.config();

class AIService {
  private apiKey: string;
  private client: MonsterApiClient;

  constructor() {
    this.apiKey = process.env.MONSTER_API_KEY as string;
    this.client = new MonsterApiClient(this.apiKey);
  }

  public async image2image(init_image_url: string): Promise<string> {
    const prompt = `cartoon style, simplified, pastel tone, `;

    const model = 'pix2pix';
    const input = {
      prompt,
      init_image_url,
      negprompt: "text, watermark, blurred, low resolution",
      steps: 50,
      guidance_scale: 30,
      image_guidance_scale: 2,
    };

    try {
      const response = await this.client.generate(model, input);
      return response.output[0];
    } catch (error) {
      console.error("Error generating image:", error);
      return "";
    }
  }
}

export default AIService;