import { ChatHeader } from "@/components/ChatHeader";
import { ChatInterface } from "@/components/ChatInterface";

export default function Index() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader />
      <main className="flex-1 overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}