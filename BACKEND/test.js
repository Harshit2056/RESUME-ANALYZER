import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

try {
  const response = await ai.models.generateContent({
    model: "	gemini-3.5-flash-lite",
    contents: "Say Hello",
  });

  console.log(response.text);
} catch (err) {
  console.error(err);
}