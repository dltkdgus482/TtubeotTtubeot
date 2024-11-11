import { log } from "console";
import dotenv from "dotenv";
import MonsterApiClient from "monsterapi";
import OpenAI from "openai";
import axios from "axios";

dotenv.config();

class AIService {
  private client: MonsterApiClient;
  private openai: OpenAI;

  constructor() {
    const monsterApiKey = process.env.MONSTER_API_KEY as string;
    const openaiApiKey = process.env.OPEN_AI_API_KEY as string;
    this.client = new MonsterApiClient(monsterApiKey);
    this.openai = new OpenAI({ apiKey: openaiApiKey });
  }

  private getAnimalPerspective(ttubeotId: number): string {
    const perspectives: { [key: number]: string } = {
      1: "seal",
      2: "dog",
      3: "fox",
      4: "rabbit",
    };
    return perspectives[ttubeotId] || "animal";
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

  private async analyzeImage(imageUrl: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image in detail, focusing on the following aspects:
              
              1. Primary Subjects: Identify the main subjects or focal points of the image, such as people, animals, or objects, and describe their positions and interactions with each other.
              
              2. Background and Environment: Describe the setting or landscape in the background, including any notable geographical features, weather conditions, time of day, or lighting effects.
              
              3. Colors and Atmosphere: Highlight the overall color palette and tones used in the image, and analyze how these contribute to the mood or atmosphere (e.g., warm, vibrant, serene, dramatic).
              
              4. Textures and Small Details: Examine any visible textures or intricate details, like patterns, shadows, or reflections, to provide a deeper understanding of the materials and surfaces.
              
              5. Emotion and Context: Suggest any emotions, stories, or possible context conveyed by the image based on the subjects’ expressions, body language, or the environment.
              
              6. Perspective and Composition: Analyze the perspective from which the image is viewed, noting any effects this may have on the viewer's perception, and evaluate the composition in terms of balance and visual flow.
              
              Provide a thorough analysis that combines these aspects for a comprehensive understanding of the image.`,
              },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      });
      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error("Image analysis failed.");
    }
  }

  private async generatePromptText(
    analyzedImage: string,
    perspectiveHeight: string,
    animalPerspective: string
  ): Promise<string> {
    const messageContent = `
    Create an animated-style image seen from a low, animal perspective at around ${perspectiveHeight}.  
    This view captures a peaceful outdoor setting, with no other animals visible.  
    The animal, ${animalPerspective}, is gently following its owner, who is just ahead on a walk,  
    creating a calm, exploratory atmosphere filled with curiosity.  
    
    Incorporate elements from ${analyzedImage} into the scene to enrich the landscape,  
    while maintaining a soft, adorable look with vibrant colors.  
    Ensure the image has clear, well-defined details with no blurred lines.  
    
    Emphasize a warm, inviting ambiance with charming, lively surroundings.  
    Avoid any text or signs, focusing only on the landscape and surrounding details  
    to bring the animated experience vividly to life.  
    
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: messageContent }],
      });
      return (
        response.choices[0]?.message?.content || "Prompt generation failed."
      );
    } catch (error) {
      console.error("Error generating prompt:", error);
      throw new Error("Prompt generation failed.");
    }
  }

  public async generatePromptFromImage(
    imageUrl: string,
    ttubeotId: number
  ): Promise<string> {
    const animalPerspective = this.getAnimalPerspective(ttubeotId);
    const perspectiveHeight = ["seal", "dog", "fox", "rabbit"].includes(
      animalPerspective
    )
      ? "low"
      : "high";

    const analyzedImage = await this.analyzeImage(imageUrl);
    return await this.generatePromptText(
      analyzedImage,
      perspectiveHeight,
      animalPerspective
    );
  }

  public async generateImageFromPrompt(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.monsterapi.ai/v1/generate/sdxl-base",
        {
          enhance: false,
          optimize: false,
          prompt: prompt,
          negprompt: "text, watermark, blurred, low resolution",
          steps: 50,
          guidance_scale: 30,
          style: "enhance",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MONSTER_API_KEY}`,
          },
        }
      );
      return response.data.output?.[0] || "Image generation failed.";
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Image generation failed.");
    }
  }

  // 프롬프트를 생성하고 이를 바탕으로 이미지를 생성하는 메서드
  public async generateImageBasedOnPrompt(
    imageUrl: string,
    ttubeotId: number
  ): Promise<string> {
    const prompt = await this.generatePromptFromImage(imageUrl, ttubeotId);
    return await this.generateImageFromPrompt(prompt);
  }

  // public async generatePromptFromImageAnalysis(
  //   image_url: string,
  //   ttubeot_id: number
  // ) {
  //   const openai = new OpenAI();

  //   try {
  //     // Step 1: 이미지 분석 요청
  //     const completion = await openai.chat.completions.create({
  //       model: "gpt-4o-mini", // 이미지 분석이 가능한 모델을 사용해야 함
  //       messages: [
  //         {
  //           role: "user",
  //           content: [
  //             { type: "text", text: "What's in this image?" },
  //             {
  //               type: "image_url",
  //               image_url: {
  //                 url: image_url,
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     // 이미지 분석 결과 추출
  //     const imageDescription = completion.choices[0].message.content;

  //     // Step 2: ttubeot_id에 따른 동물 시점 설명 프롬프트 생성
  //     const animalPerspective =
  //       {
  //         1: "seal",
  //         2: "dog",
  //         3: "fox",
  //         4: "rabbit",
  //       }[ttubeot_id] || "animal"; // 기본 값은 'animal'로 설정

  //     const animalPerspectivePrompt = `Describe this scene as if it were viewed from a ${animalPerspective}'s perspective. The ${animalPerspective} is observing the surroundings, close to the ground. Here is the scene description: ${imageDescription}`;

  //     // Step 3: 동물 시점의 설명을 요청
  //     const animalCompletion = await openai.chat.completions.create({
  //       model: "gpt-4o-mini",
  //       messages: [
  //         {
  //           role: "user",
  //           content: [{ type: "text", text: animalPerspectivePrompt }],
  //         },
  //       ],
  //     });

  //     console.log(animalCompletion.choices[0].message.content);

  //     return animalCompletion.choices[0].message.content;
  //   } catch (error) {
  //     // 에러 발생 시 로그 출력
  //     console.error(
  //       "Error occurred during image analysis or prompt generation:",
  //       error
  //     );
  //     return "";
  //   }
  // }
}

export default AIService;
