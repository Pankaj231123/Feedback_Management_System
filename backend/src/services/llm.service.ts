import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { config } from "../config/env.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: config.gemini.apiKey,
  modelName: "gemini-1.0-pro",
  temperature: 0.3,
});

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  category: "The category of feedback: Bug, Feature Request, Complaint, Praise, or Other",
  priority: "Priority level: Low, Medium, or High",
  sentiment: "Customer sentiment: Positive, Neutral, or Negative",
  team: "Target team: Engineering, Product, Support, or Sales",
});

const formatInstructions = parser.getFormatInstructions();

const prompt = PromptTemplate.fromTemplate(`
You are an expert feedback classification system. Analyze the user feedback and extract structured information.

Follow these rules:
1. Return ONLY valid JSON matching the format below
2. Be concise and accurate
3. Category must be one of: Bug, Feature Request, Complaint, Praise, Other
4. Priority must be one of: Low, Medium, High
5. Sentiment must be one of: Positive, Neutral, Negative
6. Team must be one of: Engineering, Product, Support, Sales

{format_instructions}

User Feedback:
"{feedback}"

Return only the JSON, no other text. No markdown code blocks.
`);

export async function classifyFeedback(feedbackMessage: string) {
  try {
    const chain = prompt.pipe(model).pipe(parser);

    const result = await chain.invoke({
      feedback: feedbackMessage,
      format_instructions: formatInstructions,
    });

    return result as {
      category: string;
      priority: string;
      sentiment: string;
      team: string;
    };
  } catch (error) {
    console.error("❌ LLM Classification Error:", error);
    // Return default values on error
    return {
      category: "Other",
      priority: "Medium",
      sentiment: "Neutral",
      team: "Support",
    };
  }
}
