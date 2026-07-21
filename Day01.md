# Day 0 – AI Engineering Setup & Gemini API Exploration

**Date:** 20-07-2026  
**Status:** ✅ Completed (Setup & Debugging)

---

# Objective

Set up the development environment for building AI applications using **Next.js** and explore how to integrate the **Google Gemini API**.

---

# What I Did

## 1. Created a Next.js Project

Created a new Next.js application using:

- TypeScript
- App Router
- Tailwind CSS

**Command**

```bash
npx create-next-app@latest nextjs-ai-chatbot
```

---

## 2. Installed Required Packages

```bash
npm install @google/genai zod
```

### Purpose

| Package | Purpose |
|---------|---------|
| @google/genai | Official Google Gemini SDK |
| zod | Request validation |

---

## 3. Configured Environment Variables

Created a `.env.local` file.

```env
GEMINI_API_KEY=your_api_key
```

---

## 4. Created Gemini Client

Created:

```
lib/gemini.ts
```

```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default ai;
```

### Learned

- Environment variables
- API key management
- Creating a reusable Gemini client

---

## 5. Created Chat API Route

Created:

```
app/api/chat/route.ts
```

Implemented:

- POST request
- Read user message
- Send prompt to Gemini
- Return AI response

---

## 6. Built Chat UI

Implemented:

- Input box
- Send button
- Loading state
- Chat history
- Fetch API call
- Display user message
- Display AI response

---

# Request Flow

```
User

↓

React Frontend

↓

fetch("/api/chat")

↓

Next.js API Route

↓

Gemini API

↓

Gemini Response

↓

Frontend

↓

Display Response
```

---

# Problems Faced

## Problem 1

### Error

```
404 Model Not Found
```

### Reason

The selected Gemini model was no longer available.

### Fix

Tried supported Gemini models.

---

## Problem 2

### Error

```
405 Method Not Allowed
```

### Reason

Frontend sent a POST request while the backend only supported GET.

### Fix

Changed the API route back to POST.

---

## Problem 3

### Error

```
429 RESOURCE_EXHAUSTED
```

```
Quota exceeded
limit: 0
```

### Reason

The Gemini API project had no available quota.

### Learning

- The application code was correct.
- The API request reached Google successfully.
- The failure occurred because the API project had zero available quota.

---

# HTTP Status Codes Learned

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 404 | Model not found |
| 405 | HTTP method not allowed |
| 429 | Quota exceeded / Too many requests |
| 500 | Internal server error |

---

# New Concepts Learned

- Next.js App Router
- API Routes
- Environment Variables
- Gemini SDK
- Fetch API
- POST Requests
- API Keys
- Error Handling
- HTTP Status Codes

---

# Key Learnings

- AI applications require a valid API key and available API quota.
- Reading API error messages helps identify whether an issue is related to code or account configuration.
- Environment variables should never be committed to GitHub.
- The frontend, backend, and AI provider communicate through API requests.

---

# Challenges

- Gemini API quota returned:

```
429 RESOURCE_EXHAUSTED
limit: 0
```

Because of this, the chatbot could not generate responses even though the application was working correctly.

---

# Next Steps

- Explore free AI providers:
  - OpenRouter
  - Groq
- Continue building the chatbot using a free API.
- Learn the Vercel AI SDK.
- Build a production-ready AI chatbot.

---

# Summary

- ✅ Created a Next.js AI project.
- ✅ Integrated the Gemini SDK.
- ✅ Built a chatbot UI.
- ✅ Created a backend API route.
- ✅ Understood request/response flow.
- ✅ Debugged multiple API errors.
- ✅ Identified that the remaining issue is API quota rather than application code.

---

**Time Spent:** ~3–4 Hours

**Overall Progress:** ✅ Day 0 Completed