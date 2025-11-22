import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChatbotLogo } from "./ChatbotLogo";
import ReactMarkdown from "react-markdown";

export default function ChatBotPage() {
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hi there! What can I help you with?" },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: userText }]);
    setInputMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "supersecretkey123",
        },
        body: JSON.stringify({
          question: userText,
          use_llm: true,
        }),
      });

      const data = await response.json();
      const botReply = data.answer || "Sorry, I couldn't understand that.";

      // Add bot message
      setMessages((prev) => [...prev, { type: "bot", content: botReply }]);
    } catch (error) {
      console.error("Backend error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "Error: Unable to reach server. Please check your backend.",
        },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* TOP BAR */}
      <nav className="bg-white shadow-md px-8 py-4 flex items-center gap-4 flex-shrink-0">
        <ChatbotLogo />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">TechMate</h1>
          <p className="text-sm text-gray-600">
            Your AI Assistant for Technical Education
          </p>
        </div>
      </nav>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-xl p-3 rounded-lg whitespace-pre-line ${
                    msg.type === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.type === "bot" ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />

            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-white px-8 py-3 flex-shrink-0">
          <p className="text-center text-xs text-gray-500 max-w-4xl mx-auto">
            © 2025 Department of Technical Education. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
