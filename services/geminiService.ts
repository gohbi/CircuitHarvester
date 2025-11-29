import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    deviceName: {
      type: Type.STRING,
      description: "The likely name or type of the device based on the board layout and labels.",
    },
    deviceFunction: {
      type: Type.STRING,
      description: "A brief explanation of what this device did.",
    },
    estimatedAge: {
      type: Type.STRING,
      description: "Estimated manufacturing era based on components (e.g., 'Late 90s', 'Modern').",
    },
    safetyWarnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical safety warnings for disassembling this specific type of electronics (e.g., capacitors, toxic materials).",
    },
    parts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Component name (e.g., '555 Timer IC', 'Stepper Motor')." },
          type: { type: Type.STRING, description: "Category (e.g., 'Microcontroller', 'Passive', 'Electromechanical')." },
          description: { type: Type.STRING, description: "What this specific part does." },
          harvestability: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Ease of removal and reuse utility." },
          projectIdeas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 2-3 cool project ideas for this harvested part.",
          },
        },
        required: ["name", "type", "description", "harvestability", "projectIdeas"],
      },
    },
  },
  required: ["deviceName", "deviceFunction", "parts", "safetyWarnings"],
};

export const analyzeCircuitBoard = async (base64Image: string): Promise<AnalysisResult> => {
  // Strip the data URL prefix if present to get just the base64 data
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: `Analyze this image of a circuit board or electronic device. 
            Identify the device by reading visible labels on the PCB or chips. 
            List the most useful components that a hobbyist could harvest for their own projects.
            Provide specific project ideas for the harvested parts.
            Be educational and inspire wonder about how it works.
            Focus on identifying specific chips, motors, or sensors if visible.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more factual analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};
