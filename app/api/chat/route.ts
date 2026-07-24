import { getAIResponse } from "@/lib/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const input = body.input as string;
  const history = body.history as Array<{ role: string; content: string }>;

  const response = await getAIResponse(input, history.map((entry) => ({ role: entry.role === "assistant" ? "model" : "user", content: entry.content })));
  return NextResponse.json({ response });
}
