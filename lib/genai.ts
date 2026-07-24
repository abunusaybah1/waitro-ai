import { GoogleGenAI } from "@google/genai";
import { parseStrictJson } from "@/lib/jsonParser";
import { menuItems } from "@/data/data";
import { findSimilarItems } from "@/lib/helpers";

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

function buildLocalResponse(input: string) {
  const text = input.toLowerCase();
  const availableItems = menuItems.filter((item) => item.availability);
  const matchedItem = availableItems.find((item) => text.includes(item.name.toLowerCase()));
  const requestedItem = menuItems.find((item) => text.includes(item.name.toLowerCase()));
  const suggestions = findSimilarItems(text).filter((item) => item.availability);

  if (matchedItem) {
    return {
      type: "food",
      food: matchedItem,
      message: `Absolutely — ${matchedItem.name} is available. It takes about ${matchedItem.preparationTime} to prepare and costs ${matchedItem.price.toFixed(2)} USD.`,
    };
  }

  if (requestedItem && !requestedItem.availability) {
    return {
      type: "food_unavailable",
      message: `${requestedItem.name} is currently unavailable. Here are some available meals you can try instead:`,
      suggestions: suggestions.length > 0 ? suggestions : availableItems.slice(0, 3),
    };
  }

  if (text.includes("pizza") || text.includes("burger") || text.includes("pasta") || text.includes("salmon") || text.includes("taco") || text.includes("latte") || text.includes("meal") || text.includes("food") || text.includes("dish") || text.includes("order") || text.includes("want") || text.includes("add") || text.includes("buy") || text.includes("eat") || text.includes("try")) {
    return {
      type: "food_not_found",
      message: "I don’t see that exact item on the current menu right now, but here are a few available meals you can enjoy.",
      suggestions: suggestions.length > 0 ? suggestions : availableItems.slice(0, 3),
    };
  }

  if (text.includes("who won") || text.includes("weather") || text.includes("capital")) {
    return {
      type: "off_topic",
      message: "I’m here to assist you with making food orders. Please let me know what you’d like to order today.",
      suggestions: availableItems.slice(0, 3),
    };
  }

  return {
    type: "greeting",
    message: "Hello 👋 Welcome to Waitro AI. I’m your AI restaurant assistant. How may I serve you today?",
  };
}

export async function getAIResponse(input: string, history: ChatMessage[] = []): Promise<unknown> {
  const localResponse = buildLocalResponse(input);

  if (!ai) {
    return localResponse;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemma-4",
      contents: [
        { role: "system", parts: [{ text: systemPrompt }] },
        ...history.map((entry) => ({ role: entry.role, parts: [{ text: entry.content }] })),
        { role: "user", parts: [{ text: input }] },
      ],
    });

    const text = response.text ?? "";
    if (!text) {
      return localResponse;
    }

    const parsed = parseStrictJson(text);
    return parsed ?? localResponse;
  } catch {
    return localResponse;
  }
}
