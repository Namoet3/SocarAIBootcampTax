import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Sorunuzu buraya yazın..."
          disabled={disabled}
          className="flex-1 h-12 text-base rounded-xl border-border/60 focus:border-primary transition-colors"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled} 
          size="icon"
          className="h-12 w-12 rounded-xl"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Mesaj gönder</span>
        </Button>
      </form>
    </div>
  );
};