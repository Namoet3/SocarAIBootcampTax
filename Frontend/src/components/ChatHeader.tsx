"use client";

import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-card-foreground">Vergi AI Asistanı</h1>
            <p className="text-sm text-muted-foreground">Vergi ve mali konularda sorularınızı sorun</p>
          </div>
        </div>
      </div>
    </header>
  );
};
