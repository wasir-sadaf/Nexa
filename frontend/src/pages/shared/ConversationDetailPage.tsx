import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Bot, User, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
    id: number;
    content: string;
    senderType: "CUSTOMER" | "AI" | "HUMAN";
    createdAt: string;
}

interface Conversation {
    id: number;
    status: "ACTIVE" | "CLOSED" | "ESCALATED";
    createdAt: string;
    updatedAt: string;
}

export default function ConversationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [conversation, setConversation] =
        useState<Conversation | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                setIsLoading(true);
                setError("");

                const [conversationResponse, messagesResponse] =
                    await Promise.all([
                        axios.get(
                            `http://localhost:8080/api/conversations/${id}`
                        ),
                        axios.get(
                            `http://localhost:8080/api/messages/conversation/${id}`
                        ),
                    ]);

                setConversation(conversationResponse.data);
                setMessages(messagesResponse.data);
            } catch (err) {
                console.error(
                    "Failed to load conversation:",
                    err
                );
                setError("Failed to load conversation.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchConversation();
        }
    }, [id]);

    const formatDate = (date: string) => {
        if (!date) return "";

        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getStatusClass = (
        status: Conversation["status"]
    ) => {
        switch (status) {
            case "ACTIVE":
                return "border-blue-500/20 bg-blue-500/10 text-blue-400";

            case "ESCALATED":
                return "border-rose-500/20 bg-rose-500/10 text-rose-400";

            case "CLOSED":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

            default:
                return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";
        }
    };

    const formatStatus = (status: string) => {
        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getSenderName = (senderType: Message["senderType"]) => {
        switch (senderType) {
            case "CUSTOMER":
                return "You";

            case "AI":
                return "Nexa AI";

            case "HUMAN":
                return "Support Agent";

            default:
                return "Unknown";
        }
    };

    const getSenderIcon = (
        senderType: Message["senderType"]
    ) => {
        switch (senderType) {
            case "CUSTOMER":
                return <User className="h-4 w-4" />;

            case "AI":
                return <Bot className="h-4 w-4" />;

            case "HUMAN":
                return <Headphones className="h-4 w-4" />;

            default:
                return <User className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-zinc-400">
                Loading conversation...
            </div>
        );
    }

    if (error || !conversation) {
        return (
            <div className="p-8 space-y-4">
                <p className="text-rose-400">
                    {error || "Conversation not found."}
                </p>

                <button
                    onClick={() => navigate("/history")}
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    ← Back to Conversation History
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-white">
            <button
                onClick={() => navigate("/history")}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Conversation History
            </button>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Conversation CHT-{conversation.id}
                </h1>

                <div className="flex items-center gap-3 mt-2">
                    <Badge
                        variant="outline"
                        className={getStatusClass(
                            conversation.status
                        )}
                    >
                        {formatStatus(conversation.status)}
                    </Badge>

                    <span className="text-sm text-zinc-500">
                        Created {formatDate(conversation.createdAt)}
                    </span>
                </div>
            </div>

            <Card className="bg-zinc-950 border-zinc-800 p-6">
                <div className="space-y-6">
                    {messages.length === 0 ? (
                        <p className="text-center text-zinc-500 py-8">
                            No messages in this conversation.
                        </p>
                    ) : (
                        messages.map((message) => {
                            const isCustomer =
                                message.senderType === "CUSTOMER";

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        isCustomer
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-xl p-4 ${
                                            isCustomer
                                                ? "bg-zinc-800"
                                                : message.senderType ===
                                                    "AI"
                                                  ? "bg-blue-600/20 border border-blue-500/20"
                                                  : "bg-emerald-600/20 border border-emerald-500/20"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
                                            {getSenderIcon(
                                                message.senderType
                                            )}

                                            <span className="font-medium">
                                                {getSenderName(
                                                    message.senderType
                                                )}
                                            </span>

                                            <span>
                                                •
                                            </span>

                                            <span>
                                                {formatDate(
                                                    message.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
}