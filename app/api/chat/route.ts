import { createResource } from "@/lib/actions/resources";
import { findRelevantContent } from "@/lib/ai/embedding";
import { env } from "@/lib/env.mjs";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// POST Route handler
export async function POST(req: Request) {
  
  if (!env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.error("API Key is missing");
    return new Response(JSON.stringify({ error: "API Key is missing" }), {
      status: 400,
    });
  }

  try {
    // Retrieve the messages from the request body sent by useChat hook
    const { messages } = await req.json();

    // Pass messags to the streamText function along with model
    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system: `You are a helpful assistant. Check your knowledge base before answering any questions.
      Only respond to questions using information from tool calls.
      if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
      headers: {
        apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
      },
      tools: {
        // A tool is a function that can be called by the model to perform a specific task.
        addResource: tool({
          // An optional description of what the tool does.
          // Will be used by the language model to decide whether to use the tool.
          description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,

          // The schema of the input that the tool expects.
          // The language model will use this to generate the input.
          parameters: z.object({
            content: z
              .string()
              .describe("the content or resource to add to the knowledge base"),
          }),

          // An async function that is called with the arguments from the tool call and produces a result.
          // If not provided, the tool will not be executed automatically.
          execute: async ({ content }) => createResource({ content }),
        }),
        getInformation: tool({
          description: `get information from your knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe("the users question"),
          }),
          execute: async ({ question }) => findRelevantContent(question),
        }),
      },
      // In simple terms, on each generation, the model will decide whether it should call the tool.
      // If it deems it should call the tool, it will extract the parameters from the input and
      // then append a new message to the messages array of type tool-call.
      // The AI SDK will then run the execute function with the parameters provided by the tool-call message.
    });

    // Finally, return model’s response in AIStreamResponse format.
    return result.toDataStreamResponse();
  } catch (error) {
    console.log("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "An error occurred.." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
