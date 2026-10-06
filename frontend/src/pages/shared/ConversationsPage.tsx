import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Conversation {
    id: number;
    status: "ACTIVE" | "CLOSED" | "ESCALATED";
    createdAt: string;
    updatedAt: string;
}

export default function ConversationsPage() {
    const navigate = useNavigate();
    const { role } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                setError("");

                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("User ID not found. Please log in again.");
                }

                let url = "http://localhost:8080/api/conversations";

                if (role === "CUSTOMER") {
                    url = `http://localhost:8080/api/conversations/user/${userId}`;
                }

                const response = await axios.get(url);

                setConversations(response.data);
            } catch (err) {
                console.error("Failed to fetch conversations:", err);
                setError("Failed to load conversation history.");
            } finally {
                setIsLoading(false);
            }
        };

        if (role) {
            fetchConversations();
        }
    }, [role]);

    const getStatusClass = (status: Conversation["status"]) => {
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

    const formatDate = (date: string) => {
        if (!date) return "Unknown";

        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const handleReadLog = (conversationId: number) => {
        navigate(`/history/${conversationId}`);
    };

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Conversation History
                </h1>

                <p className="text-zinc-400 mt-1">
                    Review your previous AI and support conversations.
                </p>
            </div>

            {error && (
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-rose-400">{error}</p>
                </Card>
            )}

            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400 w-12" />

                            <TableHead className="text-zinc-400">
                                Chat ID
                            </TableHead>

                            <TableHead className="text-zinc-400">
                                Status
                            </TableHead>

                            <TableHead className="text-zinc-400">
                                Created
                            </TableHead>

                            <TableHead className="text-zinc-400">
                                Last Updated
                            </TableHead>

                            <TableHead className="text-zinc-400 text-right">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-zinc-800">
                                <TableCell
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-zinc-500"
                                >
                                    Loading conversation history...
                                </TableCell>
                            </TableRow>
                        ) : conversations.length === 0 ? (
                            <TableRow className="border-zinc-800">
                                <TableCell
                                    colSpan={6}
                                    className="px-6 py-8 text-center text-zinc-500"
                                >
                                    No conversation history found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            conversations.map((conversation) => (
                                <TableRow
                                    key={conversation.id}
                                    className="border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                                >
                                    <TableCell>
                                        <MessageCircle className="h-4 w-4 text-zinc-500" />
                                    </TableCell>

                                    <TableCell className="font-medium text-zinc-300">
                                        CHT-{conversation.id}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={getStatusClass(
                                                conversation.status
                                            )}
                                        >
                                            {formatStatus(
                                                conversation.status
                                            )}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-zinc-400">
                                        {formatDate(
                                            conversation.createdAt
                                        )}
                                    </TableCell>

                                    <TableCell className="text-zinc-400">
                                        {formatDate(
                                            conversation.updatedAt
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleReadLog(
                                                    conversation.id
                                                )
                                            }
                                            className="bg-white text-black hover:bg-zinc-200"
                                        >
                                            Read Log
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}