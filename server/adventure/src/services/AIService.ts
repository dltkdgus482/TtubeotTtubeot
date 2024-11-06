import { log } from "console";
import dotenv from "dotenv";
import MonsterApiClient from "monsterapi";
import OpenAI from "openai";

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

    const model = "pix2pix";
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

  public async generateImageFromPrompt(prompt: string): Promise<string> {
    const model = "sdxl-base";
    const input = {
      prompt,
    };

    try {
      const response = await this.client.generate(model, input);
      return response.output[0];
    } catch (error) {
      console.error("Error generating image:", error);
      return "";
    }
  }

  public async generatePromptFromImageAnalysis(
    image_url: string,
    ttubeot_id: number
  ) {
    const openai = new OpenAI();

    try {
      // Step 1: 이미지 분석 요청
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // 이미지 분석이 가능한 모델을 사용해야 함
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What's in this image?" },
              {
                type: "image_url",
                image_url: {
                  url: image_url,
                },
              },
            ],
          },
        ],
      });

      // 이미지 분석 결과 추출
      const imageDescription = completion.choices[0].message.content;

      // Step 2: ttubeot_id에 따른 동물 시점 설명 프롬프트 생성
      const animalPerspective =
        {
          1: "seal",
          2: "dog",
          3: "fox",
          4: "rabbit",
        }[ttubeot_id] || "animal"; // 기본 값은 'animal'로 설정

      const animalPerspectivePrompt = `Describe this scene as if it were viewed from a ${animalPerspective}'s perspective. The ${animalPerspective} is observing the surroundings, close to the ground. Here is the scene description: ${imageDescription}`;

      // Step 3: 동물 시점의 설명을 요청
      const animalCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: animalPerspectivePrompt }],
          },
        ],
      });

      console.log(animalCompletion.choices[0].message.content);

      return animalCompletion.choices[0].message.content;
    } catch (error) {
      // 에러 발생 시 로그 출력
      console.error(
        "Error occurred during image analysis or prompt generation:",
        error
      );
      return "";
    }
  }
}

export default AIService;
