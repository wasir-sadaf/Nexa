import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NewTicketForm from "../../components/NewTicketForm"; // Adjust import path if needed

interface Ticket {
    id: string;
    subject: string;
    status: string;
    lastUpdated: string;
}

export default function TicketsPage() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/tickets");
            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch tickets when the page first loads
    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="max-w-5xl mx-auto space-y-8 text-zinc-100">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                <p className="text-zinc-400 mt-2">Manage and track your customer support requests.</p>
            </div>

            {/* The form you just built. When it succeeds, it triggers fetchTickets to refresh the table! */}
            <NewTicketForm onTicketCreated={fetchTickets} />

            <div className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                    <tr>
                        <th className="px-6 py-4 font-medium">Ticket ID</th>
                        <th className="px-6 py-4 font-medium">Subject</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Last Updated</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                Loading tickets...
                            </td>
                        </tr>
                    ) : tickets.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                No tickets found. Create one above!
                            </td>
                        </tr>
                    ) : (
                        tickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                onClick={() => navigate(`/tickets/${ticket.id.replace('TKT-', '')}`)}
                                className="hover:bg-zinc-900/50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 font-medium text-zinc-300">{ticket.id}</td>
                                <td className="px-6 py-4">{ticket.subject}</td>
                                <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                            ${ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                                            ${ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                        `}>
                                            {ticket.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400">{ticket.lastUpdated}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}