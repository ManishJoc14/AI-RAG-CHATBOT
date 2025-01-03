"use client";

import { useChat } from "ai/react";
// The useChat hook enables the streaming of chat messages
// from our AI provider (we will be using OpenAI),
// manages the state for chat input, and updates the UI automatically
// as new messages are received.

// NOTE - By default, useChat will send a POST request to the /api/chat endpoint
// with the messages as the request body.
// import { generateText } from "ai";
// import { createOpenAI, openai } from "@ai-sdk/openai";
// import { useEffect } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });

  // useEffect(() => {
  //   const openAI = createOpenAI({
  //     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  //     name: "gpt-4o",
  //   });
  //   async function get() {
  //     const { text } = await generateText({
  //       model: openAI("gpt-4o"),
  //       prompt: "What is love?",
  //     });
  //     console.log(text);
  //   }
  //   get();
  // }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {"calling tool: " + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
