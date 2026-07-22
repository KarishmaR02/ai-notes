type Props = {
  message: {
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  };
};

export default function Message({ message }: Props) {
  const isUser = message.role === "user";
  const textContent =
    message.content ||
    message.parts?.filter((p) => p.type === "text").map((p) => p.text).join("") ||
    "";

  return (
    <div
      className={`p-4 rounded-lg ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-white text-gray-900 border border-gray-200 shadow-sm"
      }`}
    >
      <strong className={`block text-xs mb-1 ${isUser ? "text-blue-100" : "text-gray-500"}`}>
        {isUser ? "You" : "AI Assistant"}
      </strong>

      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {textContent}
      </div>
    </div>
  );
}