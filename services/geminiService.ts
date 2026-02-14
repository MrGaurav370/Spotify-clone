
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMusicRecommendations = async (mood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 song titles and artists that fit the mood: "${mood}". Provide them in a list format with descriptions of why they fit.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["title", "artist", "reason"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      { title: "Midnight City", artist: "M83", reason: "Perfect for late night vibes." },
      { title: "Weightless", artist: "Marconi Union", reason: "Ultimate relaxation." }
    ];
  }
};
