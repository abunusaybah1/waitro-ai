import { useCallback, useEffect, useState } from "react";
import { getAIResponse, type ChatMessage } from "@/lib/genai";
import { speakText, stopSpeech } from "@/lib/speech";
import { type MenuItem } from "@/data/data";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  payload?: unknown;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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
    const payload = response as { type?: string; message?: string; food?: MenuItem; [key: string]: unknown };
    const assistantText = payload?.message ?? "I’m here to help you order.";

    pushMessage({ role: "assistant", content: assistantText, payload: response });
    setLoading(false);
    setSpeaking(true);
    speakText(assistantText);
  }, [messages, pushMessage]);

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
