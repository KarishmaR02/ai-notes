"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  updatedAt: number;
}

const generateUUID = () => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load conversations from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatbot_conversations");
    const savedActiveId = localStorage.getItem("chatbot_active_id");

    let loadedConversations: Conversation[] = [];
    if (saved) {
      try {
        loadedConversations = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse conversations", e);
      }
    }

    if (loadedConversations.length === 0) {
      const initialId = generateUUID();
      loadedConversations = [
        {
          id: initialId,
          title: "New Chat",
          messages: [],
          updatedAt: Date.now(),
        },
      ];
      localStorage.setItem("chatbot_conversations", JSON.stringify(loadedConversations));
      localStorage.setItem("chatbot_active_id", initialId);
      setConversations(loadedConversations);
      setActiveId(initialId);
    } else {
      // Sort conversations by updatedAt descending
      loadedConversations.sort((a, b) => b.updatedAt - a.updatedAt);
      setConversations(loadedConversations);
      if (savedActiveId && loadedConversations.some((c) => c.id === savedActiveId)) {
        setActiveId(savedActiveId);
      } else {
        setActiveId(loadedConversations[0].id);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveConversations = (updated: Conversation[]) => {
    // Keep list sorted by updatedAt descending
    const sorted = [...updated].sort((a, b) => b.updatedAt - a.updatedAt);
    setConversations(sorted);
    localStorage.setItem("chatbot_conversations", JSON.stringify(sorted));
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    localStorage.setItem("chatbot_active_id", id);
  };

  const handleNewChat = () => {
    const newId = generateUUID();
    const newChat: Conversation = {
      id: newId,
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    const updated = [newChat, ...conversations];
    saveConversations(updated);
    handleSelect(newId);
  };

  const handleRename = (id: string, newTitle: string) => {
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c
    );
    saveConversations(updated);
  };

  const handleDelete = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);

    if (activeId === id) {
      if (updated.length > 0) {
        handleSelect(updated[0].id);
      } else {
        const newId = generateUUID();
        const newChat: Conversation = {
          id: newId,
          title: "New Chat",
          messages: [],
          updatedAt: Date.now(),
        };
        saveConversations([newChat]);
        handleSelect(newId);
      }
    }
  };

  const handleMessagesChange = useCallback((id: string, messages: any[]) => {
    setConversations((prev) => {
      const chatIndex = prev.findIndex((c) => c.id === id);
      if (chatIndex === -1) return prev;

      const chat = prev[chatIndex];

      if (JSON.stringify(chat.messages) === JSON.stringify(messages)) {
        return prev;
      }

      const updatedChat = { ...chat, messages, updatedAt: Date.now() };

      // Auto-name if title is default "New Chat" and there are messages
      if (chat.title === "New Chat" && messages.length > 0) {
        const firstUserMsg = messages.find((m) => m.role === "user");
        if (firstUserMsg && firstUserMsg.content) {
          const content = firstUserMsg.content.trim();
          let autoTitle = content.slice(0, 30);
          if (content.length > 30) autoTitle += "...";
          updatedChat.title = autoTitle || "New Chat";
        }
      }

      const updated = [...prev];
      updated[chatIndex] = updatedChat;

      localStorage.setItem("chatbot_conversations", JSON.stringify(updated));
      return updated;
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#171717]">
        <div className="text-neutral-400 flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm font-medium">Loading Chatbot...</span>
        </div>
      </div>
    );
  }

  const activeChat = conversations.find((c) => c.id === activeId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
        {activeChat ? (
          <Chat
            key={activeChat.id}
            id={activeChat.id}
            title={activeChat.title}
            initialMessages={activeChat.messages}
            onMessagesChange={handleMessagesChange}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
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
            <p className="text-sm font-medium">Select or create a conversation to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}