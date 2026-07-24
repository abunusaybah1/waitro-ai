import { GoogleGenAI } from "@google/genai";
import { parseStrictJson } from "@/lib/jsonParser";
import { menuItems } from "@/data/data";

const apiKey = process.env.GOOGLE_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const systemPrompt = `You are Waitro AI, an upscale restaurant assistant.
Only answer restaurant-related questions using the provided knowledge base.
Never invent menu items or prices.
Always return valid JSON with no markdown or explanations.
If a food item is unavailable, offer similar meals from the available menu.
Politely reject unrelated questions and steer the conversation back to ordering food.
Help the customer quickly and naturally.
Knowledge base items: ${menuItems.map((item) => `${item.name} | ${item.description} | ${item.price}`).join("; ")}`;

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function getAIResponse(input: string, history: ChatMessage[] = []): Promise<unknown> {
  if (!ai) {
    return {
      type: "greeting",
      message: "Hello 👋 Welcome to Waitro AI. I’m your AI restaurant assistant. How may I serve you today?",
    };
  }

  const response = await ai.models.generateContent({
    model: "gemma-4",
    contents: [
      { role: "system", parts: [{ text: systemPrompt }] },
      ...history.map((entry) => ({ role: entry.role, parts: [{ text: entry.content }] })),
      { role: "user", parts: [{ text: input }] },
    ],
  });

  const text = response.text ?? "";
  return parseStrictJson(text);
}
