import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  // Safety settings (if needed)
  history: [
    {
      role: "user",
      parts: [
        { text: "with a Cheap budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for 3 days with each day plan with best" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "Please provide me with the following information to create a personalized hotel and itinerary suggestion..." },
      ],
    },
    {
      role: "user",
      parts: [
        { text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget..." },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n{\n  \"hotels\": [\n    ... ]\n}\n```" },
      ],
    },
  ],
});

