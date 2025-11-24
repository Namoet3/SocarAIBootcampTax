import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  timestamp,
}) => {
  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-chat-bubble-user text-chat-bubble-user-foreground ml-4"
            : "bg-chat-bubble-bot text-chat-bubble-bot-foreground mr-4 border border-border"
        )}
      >
        <div className="text-sm leading-relaxed markdown-body whitespace-pre-wrap">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {message}
          </ReactMarkdown>
        </div>

        {timestamp && (
          <p className="text-[11px] mt-2 opacity-70">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};
