import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send } from "lucide-react";

interface TicketDetail {
    id: string;
    rawId: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    customerName?: string;
    createdAt: string;
}

interface Reply {
    id: number;
    content: string;
    senderType: string;
}

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchTicketData = async () => {
        try {
            const ticketRes = await axios.get(`http://localhost:8080/api/tickets/${id}`);
            setTicket(ticketRes.data);

            const repliesRes = await axios.get(`http://localhost:8080/api/tickets/${id}/replies`);
            setReplies(repliesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketData();
    }, [id]);

    const handleSendReply = async () => {
        if (!newReply.trim()) return;
        const userRole = localStorage.getItem("userRole") || "CUSTOMER";

        try {
            await axios.post(`http://localhost:8080/api/tickets/${id}/replies`, {
                content: newReply,
                role: userRole
            });
            setNewReply("");
            fetchTicketData(); // Refresh chat
        } catch (err) {
            console.error("Failed to send reply", err);
        }
    };

    if (isLoading) return <div className="p-8 text-zinc-400">Loading...</div>;
    if (!ticket) return <div className="p-8 text-rose-400">Ticket not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 text-zinc-100">
            <button onClick={() => navigate("/tickets")} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Tickets
            </button>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-6">
                <div className="border-b border-zinc-800 pb-6">
                    <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                    <p className="text-sm text-zinc-500 mt-1">Ticket {ticket.id} • Created {ticket.createdAt}</p>
                    <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded p-4 text-zinc-300 whitespace-pre-wrap">
                        {ticket.description}
                    </div>
                </div>

                {/* Chat History */}
                <div className="space-y-4">
                    {replies.map(reply => {
                        const isCustomer = reply.senderType === "CUSTOMER";
                        return (
                            <div key={reply.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 ${isCustomer ? "bg-zinc-800 text-white" : "bg-blue-600 text-white"}`}>
                                    <p className="text-xs text-zinc-300 mb-1 font-medium">{isCustomer ? "You" : "Support Agent"}</p>
                                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply Input */}
                <div className="flex gap-2 pt-4 border-t border-zinc-800">
                    <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                        placeholder="Type a reply..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-600"
                    />
                    <button onClick={handleSendReply} className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center">
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}