import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface TicketDetail {
    id: string;
    rawId: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    customerName?: string;
    customerId?: number;
    assignedAgentName?: string;
    assignedAgentId?: number;
    createdAt: string;
    lastUpdated?: string;
}

interface Reply {
    id: number;
    content: string;
    senderType: string;
}

const statuses = [
    "OPEN",
    "IN_PROGRESS",
    "ESCALATED",
    "RESOLVED",
    "CLOSED",
];

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();

    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState("");

    const isAgent = role === "SUPPORT_AGENT";

    const fetchTicketData = async () => {
        try {
            const ticketRes = await axios.get(
                `http://localhost:8080/api/tickets/${id}`
            );

            setTicket(ticketRes.data);
            setSelectedStatus(ticketRes.data.status);

            const repliesRes = await axios.get(
                `http://localhost:8080/api/tickets/${id}/replies`
            );

            setReplies(repliesRes.data);
        } catch (error) {
            console.error("Failed to fetch ticket:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketData();
    }, [id]);

    const handleSendReply = async () => {
        if (!newReply.trim() || isSending) {
            return;
        }

        try {
            setIsSending(true);

            const senderRole =
                role === "SUPPORT_AGENT"
                    ? "SUPPORT_AGENT"
                    : "CUSTOMER";

            await axios.post(
                `http://localhost:8080/api/tickets/${id}/replies`,
                {
                    content: newReply.trim(),
                    role: senderRole,
                }
            );

            setNewReply("");

            await fetchTicketData();
        } catch (error) {
            console.error("Failed to send reply:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleStatusChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = event.target.value;

        if (!ticket || isUpdatingStatus) {
            return;
        }

        const previousStatus = selectedStatus;

        try {
            setIsUpdatingStatus(true);
            setSelectedStatus(newStatus);

            await axios.patch(
                `http://localhost:8080/api/tickets/${ticket.rawId}/status`,
                {
                    status: newStatus,
                }
            );

            const updatedTicket = await axios.get(
                `http://localhost:8080/api/tickets/${ticket.rawId}`
            );

            setTicket(updatedTicket.data);
            setSelectedStatus(updatedTicket.data.status);
        } catch (error) {
            console.error("Failed to update ticket status:", error);
            setSelectedStatus(previousStatus);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "IN_PROGRESS":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            case "ESCALATED":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            case "RESOLVED":
            case "CLOSED":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            default:
                return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "text-rose-400";
            case "MEDIUM":
                return "text-amber-400";
            case "LOW":
                return "text-emerald-400";
            default:
                return "text-zinc-400";
        }
    };

    const formatStatus = (status: string) => {
        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    if (isLoading) {
        return <div className="p-8 text-zinc-400">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="p-8 text-rose-400">Ticket not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-zinc-100">
            <button
                onClick={() => navigate("/tickets")}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
            </button>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">{ticket.id}</p>
                        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                        <p className="text-sm text-zinc-500 mt-2">
                            Created {ticket.createdAt}
                        </p>
                    </div>

                    <span
                        className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                            ticket.status
                        )}`}
                    >
                        {formatStatus(ticket.status)}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800">
                    <div>
                        <p className="text-xs text-zinc-500">Customer</p>
                        <p className="text-sm text-zinc-200 mt-1">
                            {ticket.customerName || "Unknown"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-zinc-500">Priority</p>
                        <p
                            className={`text-sm font-medium mt-1 ${getPriorityClass(
                                ticket.priority
                            )}`}
                        >
                            {ticket.priority}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-zinc-500">
                            Assigned Agent
                        </p>
                        <p className="text-sm text-zinc-200 mt-1">
                            {ticket.assignedAgentName || "Unassigned"}
                        </p>
                    </div>
                </div>

                {isAgent && (
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                        <label className="text-xs text-zinc-500">
                            Update Status
                        </label>

                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            disabled={isUpdatingStatus}
                            className="mt-2 w-full sm:w-64 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {formatStatus(status)}
                                </option>
                            ))}
                        </select>

                        {isUpdatingStatus && (
                            <p className="text-xs text-zinc-500 mt-2">
                                Updating status...
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-2">
                        Description
                    </p>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                        {ticket.description || "No description provided."}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-6">
                    Conversation
                </h2>

                <div className="space-y-4">
                    {replies.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-6">
                            No replies yet.
                        </p>
                    ) : (
                        replies.map((reply) => {
                            const isCustomer =
                                reply.senderType === "CUSTOMER";

                            const isAI = reply.senderType === "AI";

                            return (
                                <div
                                    key={reply.id}
                                    className={`flex ${
                                        isCustomer
                                            ? "justify-start"
                                            : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            isCustomer
                                                ? "bg-zinc-800 text-white"
                                                : isAI
                                                  ? "bg-zinc-700 text-white"
                                                  : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        <p className="text-xs opacity-70 mb-1 font-medium">
                                            {isCustomer
                                                ? "Customer"
                                                : isAI
                                                  ? "AI Assistant"
                                                  : "Support Agent"}
                                        </p>

                                        <p className="text-sm whitespace-pre-wrap">
                                            {reply.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex gap-2 pt-6 mt-6 border-t border-zinc-800">
                    <input
                        type="text"
                        value={newReply}
                        onChange={(event) =>
                            setNewReply(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSendReply();
                            }
                        }}
                        placeholder={
                            isAgent
                                ? "Reply to customer..."
                                : "Type a reply..."
                        }
                        disabled={isSending}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50"
                    />

                    <button
                        onClick={handleSendReply}
                        disabled={isSending || !newReply.trim()}
                        className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
