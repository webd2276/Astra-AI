
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateAIResponse = async (
  prompt: string,
  history: ChatMessage[] = [],
  systemInstruction?: string
) => {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction || "You are Astra, an elite AI software engineer. You help users build, debug, and understand code. Be concise, professional, and provide code blocks in markdown.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm having trouble connecting to my neural network right now. Please try again in a moment.";
  }
};

export const generateAIStream = async (
  prompt: string,
  history: ChatMessage[] = [],
  onChunk: (text: string) => void
) => {
  try {
    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are Astra, an elite AI software engineer. Help users build full projects. When asked to code, provide high-quality code. Use markdown for code blocks.",
        temperature: 0.7,
      },
    });

    let fullText = "";
    for await (const chunk of streamResponse) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    onChunk("Error generating response.");
    return "";
  }
};

/**
 * Rapidly scaffolds a project structure based on a prompt.
 * Uses Gemini Flash for speed.
 */
export const scaffoldProject = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a skeleton for a web project based on this prompt: "${prompt}". 
      Return ONLY a JSON object with this exact structure:
      {
        "description": "Brief project description",
        "files": [
          { "name": "index.html", "content": "...", "language": "html" },
          { "name": "styles.css", "content": "...", "language": "css" },
          { "name": "main.js", "content": "...", "language": "javascript" }
        ]
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  content: { type: Type.STRING },
                  language: { type: Type.STRING }
                },
                required: ["name", "content", "language"]
              }
            }
          },
          required: ["description", "files"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Scaffolding Error:", error);
    return null;
  }
};

/**
 * Refactors or optimizes existing code.
 */
export const refactorCode = async (code: string, instruction: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Refactor the following code based on this instruction: "${instruction}". 
      Return ONLY the updated code block without any explanation or markdown formatting unless requested in the instruction.
      
      CODE:
      ${code}`,
      config: {
        temperature: 0.3,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Refactor Error:", error);
    return code;
  }
};
