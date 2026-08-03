# Day 4 – Sidebar & Conversation History

**Date:** 03-08-2026  
**Status:** ✅ Completed (Sidebar Component, Multi-Session Management, and LocalStorage Integration)

---

## 🎯 Objective
Transition the chatbot interface from a single-session app to a fully-featured multi-session platform. The system should support:
* Creation of multiple independent chat sessions.
* Switching between active sessions instantly.
* Renaming and deleting conversations with intuitive inline controls.
* Auto-naming chat sessions dynamically using the first message sent by the user.
* Persistent browser storage so user conversations are saved across page refreshes.
* Fully responsive navigation drawer (sidebar) optimized for mobile layouts.

---

## 📦 Setup & Dependencies
No additional external libraries were installed for this phase. To avoid unnecessary bundle size and external dependencies, we implemented:
1. **HTML5 local storage APIs** for persistent client-side data storage.
2. **Web Crypto API / Math.random fallback** for client-side unique ID generation.
3. **Vanilla Tailwind CSS transitions** to build drawer animations.

---

## 🛠️ Key Technical Implementations

We structured our conversation management around three core components:

### 1. State Orchestration & LocalStorage Integration
We consolidated the active conversation states inside [page.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/app/page.tsx) to act as the single source of truth:
* **Initial Loading**: Reads `chatbot_conversations` and `chatbot_active_id` keys from `localStorage` on component mount. Automatically initializes a default "New Chat" session if no data exists.
* **Auto-Sorting**: Keeps conversations sorted chronologically by their `updatedAt` timestamp (most recent at the top) whenever a chat is updated or created.
* **Inline Actions**: Manages global handlers for adding (`handleNewChat`), selecting (`handleSelect`), renaming (`handleRename`), and deleting (`handleDelete`) conversation sessions.

### 2. Parent-Child Message Synchronization
Because the Vercel AI SDK hooks (`useChat`) manage message streaming states locally inside `<Chat>`, we implemented a synchronization bridge:
* We passed down a callback `onMessagesChange(id, messages)` to [Chat.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Chat.tsx).
* A `useEffect` hook in the child component monitors changes in the stream and calls the handler to bubble messages back up to the parent page state.

```tsx
// Sync internal useChat messages to the parent page state
useEffect(() => {
  onMessagesChange(id, messages);
}, [messages, id, onMessagesChange]);
```

### 3. State-Controlled Responsive Sidebar
We created the [Sidebar.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Sidebar.tsx) component to house the history list and active actions:
* **Mobile Layout**: Uses fixed placement, overlays (`bg-black/60 backdrop-blur-sm`), and a sliding container (`-translate-x-full md:translate-x-0 md:relative`) to slide out as a navigation drawer on smaller devices.
* **Stateful Renaming Mode**: Replaces the list item with a focused text field. Uses a React `useRef` to target the input on render:
  ```tsx
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);
  ```

### 4. Smart Auto-Naming Logic
When a conversation has the default name `"New Chat"`, the parent state automatically extracts the first `user` message's text, truncates it to 30 characters, and updates the title dynamically:
```tsx
if (chat.title === "New Chat" && messages.length > 0) {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (firstUserMsg && firstUserMsg.content) {
    const content = firstUserMsg.content.trim();
    let autoTitle = content.slice(0, 30);
    if (content.length > 30) autoTitle += "...";
    updatedChat.title = autoTitle || "New Chat";
  }
}
```

---

## 🎨 Interactive Layout & Visual States

| Component / State | Action / Transition | Styling Elements | Purpose |
| :--- | :--- | :--- | :--- |
| **Sidebar Drawer** | Slide-in drawer for active sessions | `bg-[#171717]` with border `border-[#2f2f2f]` | Elegant dark background that contrasts well with the clean white chat layout. |
| **Active Session** | Visual highlights for selected chat | `bg-[#212121]` text-white font-medium | Clearly highlights the active conversation. |
| **Hover Controls** | Rename / Delete buttons reveal | `opacity-0 group-hover:opacity-100` | Reduces visual noise; reveals management options only when hovering over a chat item. |
| **Mobile Sidebar toggle** | Drawer toggle & background overlay | `fixed inset-0 bg-black/60 backdrop-blur-sm` | Creates depth and focus on mobile screens when browsing history. |

---

## 💡 Troubleshooting & Key Lessons

### 1. The Sync Loop / Infinite Rerender Trap
**The Problem**: Sending updates from `<Chat>` to the parent state on every message change triggered a parent state change. The parent then updated the `conversations` prop passed down to `<Chat>`, re-triggering the hooks and causing an infinite rerender loop.
* **The Fix**: Before committing the state change in the parent `handleMessagesChange` hook, we compare the stringified versions of the existing messages and new messages. If they are identical, the state update is bypassed, stopping the render loop:
  ```tsx
  if (JSON.stringify(chat.messages) === JSON.stringify(messages)) {
    return prev;
  }
  ```

### 2. Handling Focus and Blur Behaviors during Renaming
**The Problem**: When editing a chat name, clicking the "Save" tick button sometimes triggered the input's `onBlur` event first, executing the save callback twice or throwing reference errors.
* **The Fix**: Made `onBlur` and the Save button call the same `handleSaveRename` handler. Designed the handler to safely close the editing state after resetting the ID (`setEditingId(null)`), ensuring subsequent trigger attempts exit early without side-effects.

---

## ⚠️ Issues I'm Facing Now
During testing, I've run into a couple of active problems that need to be resolved:
* **New Chat History is Not Stored**: When I create a new chat, the conversation gets initialized, but the message history is not being persisted/saved correctly in browser storage, so messages are lost when switching or reloading.
* **Missing Date Headers for Chat History**: Right now, the sidebar just shows a raw list of chats. I need to group/header the chats under chronological categories (like "Today", "Yesterday", "Previous 7 days") to organize the history properly.

---

## 🚀 Future Roadmap
With Day 4 completed, we have a fully functional multi-session client-side chatbot. The upcoming milestones are:
* **Day 5 – Local Database Integration**: Move conversation state out of unstable client-side browser storage and into a persistent local SQLite or PostgreSQL database using an ORM like Prisma.
* **Day 6 – User Authentication**: Enable user sign-in to sync conversations across different devices.
