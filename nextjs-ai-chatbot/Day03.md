# Day 3 – Markdown & Code Syntax Highlighting

**Date:** 24-07-2026  
**Status:** ✅ Completed (Markdown Parsing, Syntax Highlighting & Copy to Clipboard Action)

---

## 🎯 Objective
Transform the chat interface from rendering plain unformatted text into a rich, interactive Markdown environment similar to ChatGPT. The AI responses must properly parse:
* Structural layouts (paragraphs, line breaks, bold/italic markup)
* Code snippets (both inline and fully styled block code)
* Detailed lists (bulleted and ordered)
* Structured grids (data tables)
* Media hyperlinks and blockquotes

---

## 📦 Setup & Dependencies
We installed and integrated three core libraries to manage parsing and syntax highlighting:

```bash
npm install react-markdown react-syntax-highlighter remark-gfm
```

### Why these packages?
1. **`react-markdown`**: A highly customizable React component that parses Markdown safely without resorting to dangerous `dangerouslySetInnerHTML`.
2. **`remark-gfm`**: A markdown plugin that adds support for GitHub Flavored Markdown (GFM). This is necessary to support tables, lists with checkboxes, strike-throughs, and auto-linking URLs.
3. **`react-syntax-highlighter`**: A robust code styling library. We chose the **Prism AST** engine over highlight.js because Prism has excellent support for modern language syntax and customizable styling tokens.

---

## 🛠️ Key Technical Implementations

Instead of rendering simple text, we overhauled [Message.tsx](file:///d:/ai-notes/nextjs-ai-chatbot/components/Message.tsx) to act as a markdown compiler. Here are the core structural changes we implemented:

### 1. Stateful Code Block Component
We isolated the rendering of block-level code into a custom `<CodeBlock>` sub-component to handle copy state management locally:

```tsx
// copy-to-clipboard state logic
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  await navigator.clipboard.writeText(code);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Reset state after 2 seconds
};
```

* Rendered using `<SyntaxHighlighter>` using the modern `vscDarkPlus` theme.
* Suppressed React 19 type errors with the `@ts-ignore` directive since standard typings for `react-syntax-highlighter` are built around React 18.

### 2. Overriding Markdown Component Tags
Using `<ReactMarkdown>`'s custom component mapper, we replaced standard HTML tags with styled, Tailwind-based elements:

```tsx
components={{
  // Customize links to open in a new tab safely
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkColor} underline transition-colors cursor-pointer`}>
      {children}
    </a>
  ),
  
  // Custom styled tables with responsive scroll wrapper
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 w-full">
      <table className={`min-w-full border-collapse rounded-lg overflow-hidden border ${tableBorder} shadow-xs`}>
        {children}
      </table>
    </div>
  ),

  // Parse inline code vs syntax-highlighted code blocks
  code(props) {
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    
    return match ? (
      <CodeBlock code={codeString} language={match[1]} {...rest} />
    ) : (
      <code className={`${codeBg} rounded px-1.5 py-0.5 font-mono text-xs`}>
        {children}
      </code>
    );
  }
}}
```

---

## 🎨 Visual Styling Matrix
To make sure the assistant and user conversations are separated clearly, we applied context-sensitive coloring rules. 

| UI Element | User Bubble (`isUser = true`) | AI Assistant Bubble (`isUser = false`) | Purpose / Design Rationale |
| :--- | :--- | :--- | :--- |
| **Main Bubble** | Dark Blue (`bg-blue-600`) | Clean White (`bg-white`) | Instant sender identification |
| **Link Colors** | Light Blue (`text-blue-200`) | Deep Blue (`text-blue-600`) | Contrast compliance for readability |
| **Inline Code** | Translucent blue highlight | Light gray container + red code text | Blends natively into bubble context |
| **Blockquote** | Blue outline + tint background | Neutral gray outline + gray background | Accents quoted contexts |
| **Tables** | Blue border accent + blue row alternating colors | Gray border accent + gray row alternating colors | Keeps tabular layouts responsive and clear |

---

## 💡 Troubleshooting & Key Lessons

### 1. TypeScript React 19 Style Conflict
Because `react-syntax-highlighter` types were constructed around React 18, compiling the project under Next.js 16/React 19 threw a type assertion error on the `<SyntaxHighlighter>`'s `style` attribute. 
* **The Fix**: Added the `// @ts-ignore` directive above the component invocation in `Message.tsx`. This tells the compiler to proceed safely, as the underlying style object structure functions perfectly at runtime.

### 2. Double Line Breaks / Whitespace Pre-Wrap Conflict
Previously, the message text container used the Tailwind utility `whitespace-pre-wrap` to honor text line endings. However, placing `whitespace-pre-wrap` on elements wrapping a `<ReactMarkdown>` element causes double space rendering (both markdown-generated lines and literal lines collide).
* **The Fix**: Removed the `whitespace-pre-wrap` class on the parent div and allowed `react-markdown` to handle line wrapping natively.

---

## 🚀 Future Roadmap
With Day 3 completed, the chatbot outputs are beautifully structured. The next milestones on the roadmap are:
* **Day 4 – Sidebar & Conversation History**: Store active conversations and allow switching between multiple active chat sessions.
* **Day 5 – Local Database Integration**: Move conversation state into persistent storage.
