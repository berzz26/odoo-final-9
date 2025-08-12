// controllers/chat.controller.ts
import type { Request, Response } from "express";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.7,
});

export const handleChat = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { message, userTripContext } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const prompt = `
You are a travel assistant helping users discover cities and activities for their trips.
User trip context: ${userTripContext || "No trip context provided."}

User question: ${message}

Answer concisely and provide personalized recommendations.
  `;

  try {
    const response = await model.invoke([
      { role: "user", content: prompt }
    ]);
    // console.log(response);


    // response.content contains the LLM's reply
    res.json({ reply: response.content });
  } catch (error) {
    console.error("LLM API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
