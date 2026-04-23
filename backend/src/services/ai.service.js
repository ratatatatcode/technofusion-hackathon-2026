// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// export const generateQuestsFromProblem = async (title, description) => {
//     const prompt = `
//       You are an AI that breaks down campus problems into actionable quests.
//       Problem Title: ${title}
//       Description: ${description}

//       Task: Break this problem into exactly 3 actionable "quests" for students.
//       Return the response in strictly valid JSON format:
//       [
//         {"title": "Quest 1 Title", "description": "Short action item"},
//         {"title": "Quest 2 Title", "description": "Short action item"},
//         {"title": "Quest 3 Title", "description": "Short action item"}
//       ]
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     const cleanedJson = text.replace(/```json|```/g, "").trim();
//     return JSON.parse(cleanedJson);
// };

// Groq implementation
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateQuestsFromProblem = async (title, description) => {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content:
                    "You are an AI that breaks down campus problems into actionable quests for university students. Always respond with strictly valid JSON only. No markdown, no explanation, no extra text.",
            },
            {
                role: "user",
                content: `
                    Problem Title: ${title}
                    Description: ${description}

                    Break this problem into exactly 3 actionable quests for students following these rules:
                    - Each quest must be realistically doable by a single student or small group
                    - At least 1 quest must be completable in 1 day (quick win)
                    - The remaining quests must be completable within 1 week
                    - Quests must be physical or on-campus actions, not theoretical or administrative
                    - Keep each description short, specific, and action-oriented
                    - Do not include quests that require budget approval, admin permission, or construction

                    Return ONLY this JSON structure:
                    [
                        {"title": "Quest 1 Title", "description": "Short action item", "duration": "1 day"},
                        {"title": "Quest 2 Title", "description": "Short action item", "duration": "3 days"},
                        {"title": "Quest 3 Title", "description": "Short action item", "duration": "1 week"}
                    ]
                `,
            },
        ],
        temperature: 0.7,
        max_tokens: 512,
    });

    const text = response.choices[0].message.content.trim();
    return JSON.parse(text);
};
