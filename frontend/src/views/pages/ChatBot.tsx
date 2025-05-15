"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { postChat } from "../../api/chatbot"; // Pastikan path benar

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const getOrCreateConversationId = (): string => {
  const key = "chatbot-conversation-id";
  let cid = localStorage.getItem(key);
  if (!cid) {
    cid = crypto.randomUUID();
    localStorage.setItem(key, cid);
  }
  return cid;
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const result = await postChat({
        message: input,
        conversation_id: getOrCreateConversationId(),
      });

      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response,
      };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (err) {
      console.error("Chat failed", err);
      setError("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 p-4 text-center font-bold text-xl">
        ChatGPT UI (Manual)
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-xl">Start the conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 p-4 rounded-lg max-w-[90%] ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {msg.role === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-800 text-white max-w-[90%]">
            <div className="flex-shrink-0 mt-1">
              <Bot className="h-5 w-5" />
            </div>
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-800 p-4">
        {error && (
          <div className="text-red-500 text-sm text-center mb-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null); // Reset error saat mengetik
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMobile ? <Send className="h-5 w-5" /> : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
