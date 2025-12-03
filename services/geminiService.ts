
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PlanData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJson = (text: string): string => {
  // Remove markdown code blocks if present
  let cleaned = text.replace(/```json\n?|\n?```/g, '');
  // Remove any leading/trailing whitespace
  return cleaned.trim();
};

export const generateNutritionPlan = async (userProfile: UserProfile, language: 'en' | 'ar'): Promise<PlanData> => {
  const model = "gemini-2.5-flash"; 

  const prompt = `
    Act as a world-class nutritionist and sports scientist. 
    Based on the following user profile, generate a 1-day personalized meal plan, a macro nutrient breakdown, and a targeted exercise protocol.
    
    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Output Requirement:
    Return valid JSON strictly matching the schema.
    Ensure cultural relevance to the Arabian region.
    Language: ${language === 'ar' ? 'Arabic' : 'English'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            macros: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                bmi: { type: Type.NUMBER },
                recommendation: { type: Type.STRING }
              }
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["breakfast", "lunch", "dinner", "snack"] },
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                  ingredients: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  }
                }
              }
            },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const cleanedText = cleanJson(response.text);
      return JSON.parse(cleanedText) as PlanData;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
