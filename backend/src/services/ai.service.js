import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });   // Key is found but API not working
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateQuestsFromProblem = async (title, description) => {
    const prompt = `
      You are an AI that breaks down campus problems into actionable quests.
      Problem Title: ${title}
      Description: ${description}

      Task: Break this problem into exactly 3 actionable "quests" for students.
      Return the response in strictly valid JSON format:
      [
        {"title": "Quest 1 Title", "description": "Short action item"},
        {"title": "Quest 2 Title", "description": "Short action item"},
        {"title": "Quest 3 Title", "description": "Short action item"}
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedJson);
};
