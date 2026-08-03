"use client";

import { useState, useEffect, useRef } from "react";

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  isOpen,
  onClose,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      handleSaveRename(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#171717] border-r border-[#2f2f2f] text-[#ececf1] flex flex-col h-full transition-transform duration-300 md:translate-x-0 md:relative md:w-68 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header/New Chat Button */}
        <div className="p-3.5 flex flex-col gap-2">
          <button
            onClick={() => {
              onNewChat();
              onClose(); // Close on mobile
            }}
            className="flex items-center gap-3 px-3 py-3 border border-[#4d4d4d] rounded-lg text-sm font-medium text-white hover:bg-[#2d2d2d] transition-all duration-200 cursor-pointer active:scale-[0.98] w-full"
          >
            {/* Plus Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="text-[11px] font-semibold tracking-wider text-neutral-500 uppercase px-3 py-2">
            Conversations
          </div>
          {conversations.length === 0 ? (
            <div className="text-neutral-500 text-xs text-center py-4 italic">
              No conversations yet
            </div>
          ) : (
            conversations.map((chat) => {
              const isActive = chat.id === activeId;
              const isEditing = chat.id === editingId;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelect(chat.id);
                      onClose(); // Close on mobile
                    }
                  }}
                  className={`group relative flex items-center justify-between rounded-lg text-sm transition-all duration-150 cursor-pointer select-none ${isActive
                      ? "bg-[#212121] text-white font-medium shadow-xs"
                      : "text-neutral-400 hover:bg-[#212121]/50 hover:text-white"
                    }`}
                >
                  {isEditing ? (
                    <div className="flex items-center w-full p-2 bg-[#2d2d2d] rounded-lg border border-blue-500/50">
                      <input
                        ref={inputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleSaveRename(chat.id)}
                        onKeyDown={(e) => handleKeyDown(e, chat.id)}
                        className="bg-transparent border-none outline-hidden text-white w-full text-sm py-0.5 px-1 font-normal"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveRename(chat.id);
                        }}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 py-3 px-3 pr-20 overflow-hidden w-full">
                        {/* Chat Icon SVG */}
                        <svg
                          className="flex-shrink-0 opacity-70"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span className="truncate block">{chat.title}</span>
                      </div>

                      {/* Action buttons (Rename/Delete) visible on hover (or always if active) */}
                      <div
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-opacity duration-150 ${isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                          }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Edit Icon */}
                        <button
                          onClick={(e) => handleStartRename(e, chat.id, chat.title)}
                          className="p-1 hover:text-neutral-200 hover:bg-[#2d2d2d] rounded text-neutral-400 transition-colors"
                          title="Rename"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        {/* Delete Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(chat.id);
                          }}
                          className="p-1 hover:text-red-400 hover:bg-[#2d2d2d] rounded text-neutral-400 transition-colors"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#2f2f2f] mx-3.5" />

        {/* Fixed Learning Concepts Section */}
        {/* <div className="p-4 bg-[#121212] border-t border-[#2f2f2f] select-none">
          <div className="text-xs font-semibold tracking-wider text-neutral-400 uppercase mb-3 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Concepts You'll Learn
          </div>
          <ul className="space-y-2 text-xs text-neutral-400 pl-1">
            {[
              "React State",
              "useEffect",
              "UUID",
              "Component Architecture",
              "Sidebar Layout",
              "Local Storage",
            ].map((concept) => (
              <li key={concept} className="flex items-center gap-2 hover:text-white transition-colors duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {concept}
              </li>
            ))}
          </ul>
        </div> */}
      </aside>
    </>
  );
}
