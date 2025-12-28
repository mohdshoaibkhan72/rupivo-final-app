import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the "RUPIVO Smart Assistant". 
RUPIVO is a fintech app that connects users with RBI-regulated lenders for personal loans.
Your tone is: Calm, Professional, "Bank-grade", and Concise.
Do NOT give specific financial advice or predict approval.
Explain terms like EMI, CIBIL, APR, Tenure clearly to a layperson.
If asked about safety, emphasize that RUPIVO only partners with RBI-regulated entities and uses bank-grade security.
Keep answers short (under 3 sentences where possible) as this is a mobile chat interface.
`;

export const getSmartSupportResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "I'm currently offline (API Key missing). Please check your connection.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the support server. Please try again later.";
  }
};