import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NewTicketForm from "../../components/NewTicketForm";
import { useAuth } from "@/context/AuthContext";

interface Ticket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    lastUpdated: string;
    customer?: {
        id: number;
        name: string;
    };
    assignedAgent?: {
        id: number;
        name: string;
    };
}

export default function TicketsPage() {
    const navigate = useNavigate();
    const { role } = useAuth();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            setIsLoading(true);

            const userId = localStorage.getItem("userId");

            let url = "http://localhost:8080/api/tickets";

            if (role === "CUSTOMER") {
                if (!userId) {
                    throw new Error("User ID not found.");
                }

                url = `http://localhost:8080/api/tickets/customer/${userId}`;
            }

            if (role === "SUPPORT_AGENT") {
                if (!userId) {
                    throw new Error("User ID not found.");
                }

                url = `http://localhost:8080/api/tickets/agent/${userId}`;
            }

            const response = await axios.get(url);

            setTickets(response.data);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setIsLoading(false);
        }
    }, [role]);

    useEffect(() => {
        if (role) {
            fetchTickets();
        }
    }, [role, fetchTickets]);

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

    const formatStatus = (status: string) => {
        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const pageTitle =
        role === "CUSTOMER"
            ? "My Tickets"
            : role === "SUPPORT_AGENT"
                ? "Assigned Tickets"
                : "Support Tickets";

    const pageDescription =
        role === "CUSTOMER"
            ? "Create and track your support requests."
            : role === "SUPPORT_AGENT"
                ? "View and manage your assigned support tickets."
                : "View and manage all customer support tickets.";

    return (
        <div className="max-w-5xl mx-auto space-y-8 text-zinc-100">

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {pageTitle}
                </h1>

                <p className="text-zinc-400 mt-2">
                    {pageDescription}
                </p>
            </div>

            {role === "CUSTOMER" && (
                <NewTicketForm
                    onTicketCreated={fetchTickets}
                />
            )}

            <div className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">

                <table className="w-full text-left text-sm">

                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">

                        <tr>
                            <th className="px-6 py-4 font-medium">
                                Ticket ID
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Subject
                            </th>

                            {role !== "CUSTOMER" && (
                                <th className="px-6 py-4 font-medium">
                                    Customer
                                </th>
                            )}

                            <th className="px-6 py-4 font-medium">
                                Priority
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Status
                            </th>

                            <th className="px-6 py-4 font-medium">
                                Last Updated
                            </th>
                        </tr>

                    </thead>

                    <tbody className="divide-y divide-zinc-800">

                        {isLoading ? (

                            <tr>
                                <td
                                    colSpan={role === "CUSTOMER" ? 5 : 6}
                                    className="px-6 py-8 text-center text-zinc-500"
                                >
                                    Loading tickets...
                                </td>
                            </tr>

                        ) : tickets.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={role === "CUSTOMER" ? 5 : 6}
                                    className="px-6 py-8 text-center text-zinc-500"
                                >
                                    No tickets found.
                                </td>
                            </tr>

                        ) : (

                            tickets.map((ticket) => (

                                <tr
                                    key={ticket.id}
                                    onClick={() =>
                                        navigate(`/tickets/${ticket.id}`)
                                    }
                                    className="hover:bg-zinc-900/50 transition-colors cursor-pointer"
                                >

                                    <td className="px-6 py-4 font-medium text-zinc-300">
                                        TKT-{ticket.id}
                                    </td>

                                    <td className="px-6 py-4">
                                        {ticket.subject}
                                    </td>

                                    {role !== "CUSTOMER" && (
                                        <td className="px-6 py-4 text-zinc-400">
                                            {ticket.customer?.name || "Unknown"}
                                        </td>
                                    )}

                                    <td className="px-6 py-4 text-zinc-400">
                                        {ticket.priority}
                                    </td>

                                    <td className="px-6 py-4">

                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass(
                                                ticket.status
                                            )}`}
                                        >
                                            {formatStatus(ticket.status)}
                                        </span>

                                    </td>

                                    <td className="px-6 py-4 text-zinc-400">
                                        {ticket.lastUpdated || ticket.createdAt}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}