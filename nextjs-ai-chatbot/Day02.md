# Day 2 – Vercel AI SDK Integration & Debugging Google Gemini

**Date:** 22-07-2026  
**Status:** ✅ Completed (Integration & Issues Overcome)

---

# Objective

Transition the application to use the **Vercel AI SDK** (`ai`, `@ai-sdk/react`, and `@ai-sdk/google`) to support standard, real-time chat streaming, fix active TypeScript type compilation errors, and rectify endpoint routing and API model errors.

---

# What I Did

## 1. Integrated the Vercel AI SDK
* Installed and integrated `@ai-sdk/react` for the client hooks and `@ai-sdk/google` as the LLM provider.
* Configured the chatbot state using `useChat()` in [Chat.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Chat.tsx).
* Restructured the backend in [app/api/chat/route.ts](file:///d:/ai-notes/nextjs-ai-chatbot/app/api/chat/route.ts) to stream responses using `streamText()` instead of manually handling chunks.

---

# Issues Overcome

## 1. TypeScript Error on `useChat` Configuration
### Error
```typescript
Object literal may only specify known properties, and 'api' does not exist in type 'UseChatOptions<UIMessage<unknown, UIDataTypes, UITools>>'.
```
### Cause
In modern versions of `@ai-sdk/react`, `useChat()` no longer accepts a top-level `api` parameter. Instead:
* It defaults to `/api/chat` automatically using the underlying `DefaultChatTransport`.
* Custom paths must be passed inside a transport wrapper (e.g., `transport: new DefaultChatTransport({ api: "/api/custom-route" })`).
### Fix
Removed the redundant `api: "/api/chat"` property from the `useChat()` call inside [Chat.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Chat.tsx).

---

## 2. Empty/No Response in Frontend Chat UI
### Error
The user typed prompts, but no AI responses appeared underneath them.
### Cause
The backend route in [app/api/chat/route.ts](file:///d:/ai-notes/nextjs-ai-chatbot/app/api/chat/route.ts) was returning `result.toTextStreamResponse()` (plain text). The client-side `useChat()` hook is built to expect a structured **UI Message Stream**. Since it received raw text without stream protocol metadata, the parser could not identify the message blocks.
### Fix
Changed the return call to `result.toUIMessageStreamResponse()`.

---

## 3. Backend Crash: `TypeError: messages.some is not a function`
### Error
When calling `convertToModelMessages(messages)` on the backend, the server crashed with:
```typescript
TypeError: messages.some is not a function
```
### Cause
In AI SDK v5/v7, the helper `convertToModelMessages` is asynchronous and returns a `Promise<ModelMessage[]>`. Because it was called without `await`, a raw `Promise` object was passed to `streamText({ messages })` instead of the expected array, causing internal prototype validation failure.
### Fix
Prefixed the call with `await`: `messages: await convertToModelMessages(messages)`.

---

## 4. Google API Call 404 Failure
### Error
```typescript
Error [AI_APICallError]: models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent.
```
### Cause
Google updated its Gemini endpoints on the `v1beta` API. The legacy model identifier `"gemini-1.5-flash"` was deprecated or removed, leading Google's servers to return a `404 NOT_FOUND` status code.
### Fix
Updated [lib/ai.ts](file:///d:/ai-notes/nextjs-ai-chatbot/lib/ai.ts) to target a modern active model: `"gemini-3.1-flash-lite-preview"` (or `"gemini-2.0-flash"`).

---

# Comparison: Old Setup vs. New Setup

| Feature / Aspect | Old Setup (Day 1) | New Setup (Day 2) |
|:---|:---|:---|
| **Underlying SDK** | `@google/genai` (direct Google SDK) | `@ai-sdk/google` + Vercel AI SDK (`ai`) |
| **State Management** | Manual react state arrays (`useState` for history) | Automated client state hook (`useChat`) |
| **Response Delivery** | Raw response buffers / JSON REST response | Instant, real-time UI stream chunks |
| **Error Handling** | Custom try-catch on frontend requests | Built-in client-side `onError` callback in `useChat` |
| **Gemini Model Used** | `gemini-1.5-flash` *(Deprecated / Failed with 404)* | `gemini-3.1-flash-lite-preview` / `gemini-2.0-flash` *(Active)* |

---

# Main Usage of This Application

This application serves as a **lightweight, highly responsive AI Chatbot**. It can be used for:
* **Interactive Q&A & Brainstorming**: Fast query-and-response streaming interface.
* **Code Assistant**: Asking questions about code syntax, bugs, and algorithms.
* **Writing Companion**: Crafting text summaries, drafts, emails, and translations.

---

# Future Enhancements

Here are key features we can add next:

### 1. Markdown & Code Syntax Highlighting
* **What**: Format AI responses using markdown, with syntax-highlighted code blocks.
* **How**: Install `react-markdown` and `react-syntax-highlighter` inside [Message.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Message.tsx).

### 2. Multi-Session History (Sidebar)
* **What**: Allow users to maintain multiple independent chat sessions.
* **How**: Build a sidebar component that allows adding new conversations and switching active sessions.

### 3. Database Persistence
* **What**: Retain chat history after refreshing the page.
* **How**: Store chat histories locally in browser `localStorage`, or configure a database like PostgreSQL/Supabase with Prisma.

### 4. Multimodal Support (Vision / File Uploads)
* **What**: Allow uploading images, PDFs, or documents for the AI model to analyze.
* **How**: Implement input attachments and pass the base64 media blocks inside the message parts payload.

### 5. Custom Prompts / System instructions
* **What**: Allow the user to specify a "system prompt" (e.g., "Act as a Python Expert" or "Keep responses under 3 sentences").
* **How**: Pass a custom `system` parameter to the backend `streamText()` config.
