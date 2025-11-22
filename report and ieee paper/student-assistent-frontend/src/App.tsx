import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import { ChatbotLogo } from "./components/ChatbotLogo";

// ✅ FastAPI backend endpoint & API key
const API_URL = "http://127.0.0.1:8000/ask"; // FastAPI endpoint
const BACKEND_API_KEY = "supersecretkey123"; // must match BACKEND_API_KEY in .env

// ✅ Function to call backend API
async function askBot(question) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": BACKEND_API_KEY
      },
      body: JSON.stringify({ question: question, use_llm: true })
    });
    const data = await response.json();
    // The backend returns {"answer": "...", "source": "...", "confidence": 0.9}
    return data.answer || "No answer received from backend.";
  } catch (error) {
    console.error("Error talking to backend:", error);
    return "Sorry, could not reach the backend.";
  }
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hi there! What can I help you with?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Send message handler
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = inputMessage;
      setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
      setInputMessage("");
      setLoading(true);

      // Call backend API
      const botReply = await askBot(userMessage);

      // Show bot reply
      setMessages((prev) => [...prev, { type: "bot", content: botReply }]);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-[1cm]">
      <Card className="w-full h-full shadow-xl flex flex-col">
        <CardContent className="p-8 flex flex-col h-full">
          {/* Header */}
          <div className="text-center mb-8 flex-shrink-0">
            <div className="inline-flex items-center justify-center mb-4">
              <ChatbotLogo />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              TechMate
            </h1>
            <p className="text-gray-600">
              Your AI Assistant for Technical Education
            </p>
          </div>

          {/* Chat Area */}
          <div className="bg-gray-50 rounded-lg p-4 flex-1 overflow-y-auto mb-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-xs lg:max-w-md p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-left">
                <div className="inline-block max-w-xs lg:max-w-md p-3 rounded-lg bg-white text-gray-800 rounded-bl-none shadow-sm italic">
                  Bot is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2 flex-shrink-0">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 flex-shrink-0">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8">
              Get Started - It's Free!
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            © 2024 Department of Technical Education. All rights reserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
