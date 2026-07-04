import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  return (
    <div className="px-4 py-6 pb-24 md:px-8 md:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Agent</h1>
        <p className="mt-1 text-app-text-secondary">
          Chat with Aria to share more about yourself
        </p>
      </header>

      <ChatInterface />
    </div>
  );
}
