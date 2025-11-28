"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((old) => [...old, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post<{
        reply: string;
        conversationId: string;
      }>("/api/support", {
        message: input,
        conversationId,
      });

      setConversationId(data.conversationId);

      const botMsg: Message = { role: "assistant", text: data.reply };
      setMessages((old) => [...old, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: "assistant",
        text: err.response?.data?.error || err.message || "Error: Unable to get response",
      };
      setMessages((old) => [...old, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  }, [messages, isTyping]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="flex flex-col h-[80vh]">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
            <h2 className="text-xl font-semibold text-gray-800">Support Chat</h2>
            <span className="text-sm text-gray-500">GPT-2.5 AI Assistant</span>
          </div>

          <ScrollArea className="flex-1 p-4 bg-gray-50 rounded-lg overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 max-w-[70%] text-sm shadow-md ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-5 py-3 max-w-[70%] text-sm shadow-md bg-white text-gray-500 animate-pulse">
                    Assistant is typing...
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2 items-end">
            <Textarea
              rows={1}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 resize-none rounded-xl border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 transition-colors duration-200"
            >
              <Send className="w-5 h-5 mr-1" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
