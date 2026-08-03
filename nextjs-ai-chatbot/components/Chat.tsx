"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import ChatInput from "./ChatInput";
import Message from "./Message";
import Loading from "./Loading";

interface ChatProps {
  id: string;
  title: string;
  initialMessages: any[];
  onMessagesChange: (id: string, messages: any[]) => void;
  onToggleSidebar: () => void;
}

export default function Chat({
  id,
  title,
  initialMessages,
  onMessagesChange,
  onToggleSidebar,
}: ChatProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    id,
    initialMessages,
    onError: (err) => {
      console.error("Chat Error:", err);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Sync internal useChat messages to the parent state
  useEffect(() => {
    onMessagesChange(id, messages);
  }, [messages, id, onMessagesChange]);

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
    <div className="max-w-4xl mx-auto p-5 w-full flex flex-col min-h-screen">
      {/* Header section with mobile hamburger toggle */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer active:scale-95 flex items-center justify-center border border-gray-200"
          title="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="text-2xl text-black font-bold flex-1 truncate">
          {title}
        </h1>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          <strong>Error:</strong> {error.message || "Failed to fetch response. Please check your API key and connection."}
        </div>
      )}

      {/* Message container */}
      <div className="space-y-4 mb-6 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-40"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="text-sm font-medium">How can I help you today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
            />
          ))
        )}

        {isLoading && (
          <div className="p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm">
            <Loading />
          </div>
        )}
      </div>

      {/* Input section fixed at bottom */}
      <div className="pt-2 border-t border-gray-100 bg-gray-100">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={isLoading}
        />
      </div>
    </div>
  );
}