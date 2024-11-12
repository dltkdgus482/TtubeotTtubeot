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

  animalPerspectives = [
    { id: 1, name: "Dog" },
    { id: 2, name: "Cat" },
    { id: 3, name: "Chick" },
    { id: 4, name: "Duck" },
    { id: 5, name: "Hen" },
    { id: 6, name: "Rooster" },
    { id: 7, name: "Dove" },
    { id: 8, name: "Pigeon" },
    { id: 9, name: "Parrot" },
    { id: 10, name: "Crow" },
    { id: 11, name: "Hornbill" },
    { id: 12, name: "SnowOwl" },
    { id: 13, name: "Owl" },
    { id: 14, name: "Penguin" },
    { id: 15, name: "Mouse" },
    { id: 16, name: "SnowWeasel" },
    { id: 17, name: "Rabbit" },
    { id: 18, name: "Tortoise" },
    { id: 19, name: "ArcticFox" },
    { id: 20, name: "Snake" },
    { id: 21, name: "GoldFish" },
    { id: 22, name: "Eagle" },
    { id: 23, name: "Flamingo" },
    { id: 24, name: "Ostrich" },
    { id: 25, name: "Fox" },
    { id: 26, name: "Hyena" },
    { id: 27, name: "Cheetah" },
    { id: 28, name: "Wolf" },
    { id: 29, name: "Racoon" },
    { id: 30, name: "Pig" },
    { id: 31, name: "Hog" },
    { id: 32, name: "Sheep" },
    { id: 33, name: "Gazelle" },
    { id: 34, name: "Reindeer" },
    { id: 35, name: "Donkey" },
    { id: 36, name: "Zebra" },
    { id: 37, name: "Seal" },
    { id: 38, name: "Walrus" },
    { id: 39, name: "Cow" },
    { id: 40, name: "Buffalo" },
    { id: 41, name: "Ox" },
    { id: 42, name: "Rhino" },
    { id: 43, name: "Hippo" },
    { id: 44, name: "Polarbear" },
    { id: 45, name: "Elephant" },
  ];

  private getAnimalPerspective(ttubeotId: number): string {
    log("getAnimalPerspective: 시작", { ttubeotId });
    const animal = this.animalPerspectives.find(
      (item) => item.id === ttubeotId
    );
    log("getAnimalPerspective: 종료", { result: animal?.name || "animal" });
    return animal ? animal.name : "animal";
  }

  public async image2image(init_image_url: string): Promise<string> {
    log("image2image: 시작", { init_image_url });
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
      log("image2image: 성공", { result: response.output[0] });
      return response.output[0];
    } catch (error) {
      console.error("image2image: 오류 발생", error);
      return "";
    }
  }

  private async analyzeImage(imageUrl: string): Promise<string> {
    log("analyzeImage: 시작", { imageUrl });
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image in detail, focusing on...`,
              },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
      });
      log("analyzeImage: 성공");
      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("analyzeImage: 오류 발생", error);
      throw new Error("Image analysis failed.");
    }
  }

  private async generatePromptText(
    analyzedImage: string,
    perspectiveHeight: string,
    animalPerspective: string
  ): Promise<string> {
    log("generatePromptText: 시작", {
      analyzedImage,
      perspectiveHeight,
      animalPerspective,
    });
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
      log("generatePromptText: 성공");
      return (
        response.choices[0]?.message?.content || "Prompt generation failed."
      );
    } catch (error) {
      console.error("generatePromptText: 오류 발생", error);
      throw new Error("Prompt generation failed.");
    }
  }

  public async generatePromptFromImage(
    imageUrl: string,
    ttubeotId: number
  ): Promise<string> {
    log("generatePromptFromImage: 시작", { imageUrl, ttubeotId });
    const animalPerspective = this.getAnimalPerspective(ttubeotId);
    const lowHeightAnimals = [
      "seal",
      "dog",
      "fox",
      "rabbit",
      "cat",
      "chick",
      "duck",
      "hen",
      "mouse",
      "snowweasel",
      "tortoise",
      "arcticfox",
      "snake",
      "goldfish",
    ];
    const mediumHeightAnimals = [
      "eagle",
      "flamingo",
      "ostrich",
      "hyena",
      "cheetah",
      "wolf",
      "racoon",
      "pig",
      "hog",
      "sheep",
      "gazelle",
      "reindeer",
      "donkey",
      "zebra",
    ];

    const perspectiveHeight = lowHeightAnimals.includes(animalPerspective)
      ? "low"
      : mediumHeightAnimals.includes(animalPerspective)
      ? "medium"
      : "high";

    const analyzedImage = await this.analyzeImage(imageUrl);
    const prompt = await this.generatePromptText(
      analyzedImage,
      perspectiveHeight,
      animalPerspective
    );
    log("generatePromptFromImage: 종료");
    return prompt;
  }

  public async generateImageFromPrompt(prompt: string): Promise<string> {
    log("generateImageFromPrompt: 시작");
    try {
      const response = await this.client.generate("sdxl-base", {
        enhance: false,
        optimize: false,
        prompt: prompt,
        negprompt: "text, watermark, blurred, low resolution",
        steps: 50,
        guidance_scale: 30,
        style: "enhance",
      });
      const imageUrl = response.output?.[0];
      log("generateImageFromPrompt: 성공", { imageUrl });
      return imageUrl || "Image generation failed.";
    } catch (error) {
      console.error("generateImageFromPrompt: 오류 발생", error);
      throw new Error("Image generation failed.");
    }
  }

  public async generateImageBasedOnPrompt(
    imageUrl: string,
    ttubeotId: number
  ): Promise<string> {
    log("generateImageBasedOnPrompt: 시작", { imageUrl, ttubeotId });
    const prompt = await this.generatePromptFromImage(imageUrl, ttubeotId);
    const generatedImageUrl = await this.generateImageFromPrompt(prompt);
    log("generateImageBasedOnPrompt: 종료", { generatedImageUrl });
    return generatedImageUrl;
  }
}

export default AIService;
