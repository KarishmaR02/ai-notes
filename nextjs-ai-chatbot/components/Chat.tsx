"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import ChatInput from "./ChatInput";
import Message from "./Message";
import Loading from "./Loading";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    onError: (err) => {
      console.error("Chat Error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">

      <h1 className="text-3xl text-black font-bold mb-6">
        AI Chatbot
      </h1>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          <strong>Error:</strong> {error.message || "Failed to fetch response. Please check your API key and connection."}
        </div>
      )}

      <div className="space-y-4 mb-6">

        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
          />
        ))}

        {isLoading && (
          <div className="p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm">
            <Loading />
          </div>
        )}

      </div>

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={isLoading}
      />

    </div>
  );
}