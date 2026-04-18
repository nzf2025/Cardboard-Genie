import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectIdea, ProjectDetail } from "../types";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const IDEA_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
      estimatedTime: { type: Type.STRING },
      toolsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
      category: { type: Type.STRING },
    },
    required: ['title', 'description', 'difficulty', 'estimatedTime', 'toolsNeeded', 'category'],
  },
};

const DETAIL_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    steps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Detailed step-by-step instructions"
    },
    tips: { type: Type.STRING, description: "Helpful tips for better results" },
    safetyWarning: { type: Type.STRING, description: "Safety precautions when cutting or gluing" }
  },
  required: ['steps', 'tips', 'safetyWarning']
};

export const generateCreativeIdeas = async (
  boxType: string,
  intendedUse: string
): Promise<ProjectIdea[]> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    我有一些${boxType}。我想把它们改造成${intendedUse}。
    请给我提供3-4个具体的、有创意的DIY改造方案。
    
    要求：
    1. 方案要实用且美观。
    2. 请用简体中文回答。
    3. difficulty 字段必须是 'Easy', 'Medium', 或 'Hard' 之一。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: IDEA_SCHEMA,
        systemInstruction: "你是一位专业的DIY手工达人和环保主义者。你擅长将废旧纸箱改造成精美的家居用品。",
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data.map((item: any, index: number) => ({
      ...item,
      id: `idea-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
};

export const generateProjectDetails = async (
  idea: ProjectIdea
): Promise<ProjectDetail> => {
  if (!apiKey) throw new Error("API Key is missing");

  const prompt = `
    请为DIY项目“${idea.title}”提供详细的制作步骤。
    这是一个用纸箱做的项目，难度为${idea.difficulty}。
    请包含具体的步骤、制作小贴士和安全警告。
    请用简体中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: DETAIL_SCHEMA,
        systemInstruction: "你是一位耐心细致的手工老师，擅长分步骤讲解制作过程。",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");

    const details = JSON.parse(text);
    return {
      ...idea,
      ...details
    };
  } catch (error) {
    console.error("Error generating details:", error);
    throw error;
  }
};

export const generateProjectImage = async (
  title: string,
  description: string
): Promise<string | null> => {
  if (!apiKey) return null;

  const prompt = `
    A professional, high-quality product photography shot of a DIY cardboard project: ${title}.
    Description: ${description}.
    The object is made of recycled cardboard but looks neat, stylish, and functional.
    Clean, bright, minimalist interior background. Soft lighting.
    High resolution, photorealistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    // Extract image from response
    // The response for image generation contains inlineData in the parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};