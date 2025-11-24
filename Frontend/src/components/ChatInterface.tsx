"use client";

import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  citations?: Array<{
    location?: any;
    metadata?: any;
  }>;
}

type ChatApiResponse = {
  answer: string;
  citations?: Array<{
    location?: any;
    metadata?: any;
  }>;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://your-api-gateway-url.amazonaws.com";
const WATERMARK_SRC = "/token.png";

export const ChatInterface = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Merhaba! Vergi ve mali konularda size yardımcı olmak için buradayım. Sorularınızı sorabilirsiniz.",
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!scrollAreaRef.current) return;
    const viewport = scrollAreaRef.current.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: trimmed,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
        signal: controllerRef.current.signal,
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `HTTP ${res.status}`);
      }

      const data: ChatApiResponse = await res.json();

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        text: data.answer,
        isUser: false,
        timestamp: new Date().toISOString(),
        citations: data.citations,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Error sending message:", err);
      toast({
        title: "Hata",
        description: "Mesaj gönderilemedi. Lütfen tekrar deneyin." + (err?.message ? ` (${err.message})` : ""),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  return (
    <div className="flex h-full w-full">
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-6 relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
              <img
                src={WATERMARK_SRC}
                alt=""
                className="select-none opacity-[0.06] dark:opacity-[0.04] w-[55vw] max-w-[720px] min-w-[260px]"
              />
            </div>

            <div className="space-y-6 max-w-3xl mx-auto relative z-10">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-chat-bubble-bot text-chat-bubble-bot-foreground rounded-2xl px-4 py-3 border border-border max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm text-muted-foreground">Asistan yazıyor...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border bg-background">
            <div className="max-w-3xl mx-auto w-full">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
