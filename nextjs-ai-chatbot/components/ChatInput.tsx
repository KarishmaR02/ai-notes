type Props = {
  input: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  loading,
}: Props) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3"
    >
      <input
        value={input}
        onChange={handleInputChange}
        className="flex-1 text-black border border-gray-300 rounded-lg p-3"
        placeholder="Ask anything..."
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        Send
      </button>
    </form>
  );
}