
import { GoogleGenAI } from "@google/genai";
import { Dish, ThaliItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateDishStory = async (dish: Dish): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return "Annapurna's spirits are quiet today. (API Key missing)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the Head Chef of Annapurna, a luxury Nepali restaurant. 
      Write a short, poetic, and sensory description (max 60 words) for the dish "${dish.name}" (${dish.nepaliName}).
      Highlight these ingredients: ${dish.ingredients.join(', ')}.
      Tone: Mystical, proud, Himalayan luxury. 
      Do not use markdown formatting.`,
    });

    return response.text || "The mountains keep their secrets.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The whispers of the Himalayas are faint right now.";
  }
};

export const getConciergeRecommendation = async (vibe: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "We recommend our signature Tasting Menu.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a luxury concierge at Annapurna. The guest has chosen the "${vibe}" dining experience.
            Suggest a seating area (Window to Himalayas, By the Chulo, or Prayer Flags) and a drink to start.
            Keep it brief (1 sentence). Elegant tone.`,
        });
        return response.text || "Excellent choice.";
    } catch (e) {
        return "An excellent choice for the evening.";
    }
}

export const predictThaliProfile = async (items: ThaliItem[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "A balanced selection of flavors.";
  
  const itemNames = items.map(i => i.name).join(', ');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user has built a custom Nepali Thali with: ${itemNames}. 
      Analyze this combination in 2 short, poetic sentences. 
      Is it spicy? Is it comforting? 
      End with a playful "Chef's Rating" out of 10 for authenticity.`,
    });
    return response.text || "A delicious combination.";
  } catch (e) {
    return "A harmonious blend of mountain flavors.";
  }
}
