import OpenAI from "openai";

// Using Groq - free API with OpenAI-compatible format
const groq = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are a helpful travel assistant. Always respond with valid JSON containing:
- "hotels": array of hotel objects with these exact keys: "Hotel Name", "Hotel Address", "Price", "Hotel Image Url", "Geo Coordinates" (object with "lat" and "lng"), "Rating" (number 1-5), "Description"
- "itinerary": array of day objects, each containing "Day" (like "Day 1") and "Places" array with these exact keys: "Place Name", "Place Details", "Place Image Url", "Geo Coordinates" (object with "lat" and "lng"), "Ticket Pricing", "Time To Travel", "Best Time To Visit"

Important: Use the exact key names with spaces as specified above.`;

export const sendTripPrompt = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt + "\n\nRespond with ONLY valid JSON, no markdown formatting. Start directly with { and end with }",
      },
    ],
    temperature: 1,
    max_tokens: 8192,
  });

  const rawContent = response.choices[0].message.content;

  // Clean up markdown formatting if present
  const cleanContent = rawContent
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  return {
    response: {
      text: () => cleanContent,
    },
  };
};
