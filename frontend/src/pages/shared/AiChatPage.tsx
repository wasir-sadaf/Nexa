import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User as UserIcon } from "lucide-react";

interface ChatMessage {
    id: number;
    text: string;
    sender: "user" | "ai";
}

export default function AiChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, text: "Hello! I am Nexa's AI assistant. How can I help you today?", sender: "ai" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        const userId = parseInt(localStorage.getItem("userId") || "0", 10);

        // Add user message to UI immediately
        const newUserMsg: ChatMessage = { id: Date.now(), text: userText, sender: "user" };
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Call your Spring Boot ChatController
            const response = await axios.post("http://localhost:8080/api/chat", {
                user_id: userId,
                conversation_id: 1, // You can make this dynamic later
                message: userText
            });

            const aiResponseText = response.data.response || "I processed your request, but didn't generate a text response.";

            const newAiMsg: ChatMessage = { id: Date.now() + 1, text: aiResponseText, sender: "ai" };
            setMessages(prev => [...prev, newAiMsg]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: ChatMessage = {
                id: Date.now() + 1,
                text: "Sorry, I am having trouble connecting to the AI service right now.",
                sender: "ai"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[85vh] text-zinc-100">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
                <p className="text-zinc-400 mt-2">Describe your issue, and our AI will help resolve it or route it to an agent.</p>
            </div>

            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col overflow-hidden shadow-2xl">
                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.sender === "user" ? "bg-zinc-800" : "bg-blue-600/20 text-blue-500"
                            }`}>
                                {msg.sender === "user" ? <UserIcon className="h-5 w-5 text-zinc-400" /> : <Bot className="h-5 w-5" />}
                            </div>

                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                msg.sender === "user"
                                    ? "bg-zinc-800 text-zinc-100"
                                    : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                            }`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 flex-row">
                            <div className="h-8 w-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-1">
                                <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce"></div>
                                <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                                <div className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950">
                    <div className="flex gap-3 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-white text-black px-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}