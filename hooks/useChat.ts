import { useCallback, useEffect, useState } from "react";
import { getAIResponse, type ChatMessage } from "@/lib/genai";
import { speakText, stopSpeech } from "@/lib/speech";
import { type MenuItem } from "@/data/data";
import { useCart } from "@/hooks/useCart";

export interface ChatPayload {
  type?: string;
  message?: string;
  food?: MenuItem;
  suggestions?: MenuItem[];
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  payload?: ChatPayload;
}

export function useChat(onMealFound?: (item: MenuItem) => void, onCheckout?: () => void) {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const pushMessage = useCallback((message: ChatTurn) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const ask = useCallback(async (input: string) => {
    setLoading(true);
    pushMessage({ role: "user", content: input });

    const history = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      content: message.content,
    })) as ChatMessage[];

    const response = await getAIResponse(input, history);
    const payload = response as ChatPayload | undefined;
    const assistantText = payload?.message ?? "I’m here to help you order.";

    if (payload?.type === "food" && payload.food) {
      addItem(payload.food);
      onMealFound?.(payload.food);
      onCheckout?.();
    }

    pushMessage({ role: "assistant", content: assistantText, payload: payload });
    setLoading(false);
    setSpeaking(true);
    speakText(assistantText);
  }, [addItem, messages, onCheckout, onMealFound, pushMessage]);

  useEffect(() => {
    const onSpeechEnd = () => setSpeaking(false);
    if (typeof window !== "undefined") {
      window.speechSynthesis?.addEventListener("end", onSpeechEnd);
      return () => window.speechSynthesis?.removeEventListener("end", onSpeechEnd);
    }
  }, []);

  const stop = useCallback(() => {
    stopSpeech();
    setSpeaking(false);
  }, []);

  return { messages, loading, speaking, ask, stop, pushMessage };
}
