import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Clock,
} from "lucide-react";

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

export default function AgentDashboard() {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTickets = useCallback(async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                setError("Agent user ID not found.");
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/tickets/agent/${userId}`
            );

            setTickets(response.data);
            setError("");
        } catch (error) {
            console.error("Failed to fetch agent tickets:", error);
            setError("Failed to load assigned tickets.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();

        const interval = setInterval(fetchTickets, 5000);

        return () => clearInterval(interval);
    }, [fetchTickets]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ESCALATED":
                return (
                    <Badge className="bg-red-500/10 text-red-500 border border-red-500/50 flex gap-1 items-center w-fit">
                        <AlertCircle className="w-3 h-3" />
                        Escalated
                    </Badge>
                );

            case "OPEN":
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/50 text-amber-500"
                    >
                        Open
                    </Badge>
                );

            case "IN_PROGRESS":
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-500/50 text-blue-500"
                    >
                        In Progress
                    </Badge>
                );

            case "RESOLVED":
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-500"
                    >
                        Resolved
                    </Badge>
                );

            case "CLOSED":
                return (
                    <Badge
                        variant="outline"
                        className="border-zinc-500/50 text-zinc-400"
                    >
                        Closed
                    </Badge>
                );

            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                );
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "text-red-400";

            case "MEDIUM":
                return "text-amber-400";

            case "LOW":
                return "text-emerald-400";

            default:
                return "text-zinc-400";
        }
    };

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        (ticket) =>
            ticket.status === "OPEN" ||
            ticket.status === "IN_PROGRESS"
    ).length;

    const escalatedTickets = tickets.filter(
        (ticket) => ticket.status === "ESCALATED"
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) =>
            ticket.status === "RESOLVED" ||
            ticket.status === "CLOSED"
    ).length;

    if (loading) {
        return (
            <div className="space-y-6 text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Agent Workspace
                    </h1>

                    <p className="text-zinc-400 mt-1">
                        Manage your assigned support tickets.
                    </p>
                </div>

                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-zinc-400">
                        Loading assigned tickets...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-white">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Agent Workspace
                    </h1>

                    <p className="text-zinc-400 mt-1">
                        Manage your assigned support tickets.
                    </p>
                </div>

                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-3 py-1">
                    Status: Available
                </Badge>

            </div>

            {/* Error */}
            {error && (
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-red-400">
                        {error}
                    </p>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-4">

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Assigned Tickets
                        </CardTitle>

                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalTickets}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Active
                        </CardTitle>

                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">
                            {openTickets}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Escalated
                        </CardTitle>

                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {escalatedTickets}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Resolved
                        </CardTitle>

                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {resolvedTickets}
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Tickets */}
            <Card className="bg-zinc-950 border-zinc-800">

                <CardHeader>
                    <CardTitle>
                        Assigned Tickets
                    </CardTitle>
                </CardHeader>

                {tickets.length === 0 ? (

                    <CardContent>
                        <p className="text-center text-zinc-500 py-8">
                            No tickets assigned to you.
                        </p>
                    </CardContent>

                ) : (

                    <Table>

                        <TableHeader>

                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">

                                <TableHead className="text-zinc-400">
                                    Ticket ID
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Customer
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Subject
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Priority
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Status
                                </TableHead>

                                <TableHead className="text-right text-zinc-400">
                                    Action
                                </TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {tickets.map((ticket) => (

                                <TableRow
                                    key={ticket.id}
                                    className="border-zinc-800 hover:bg-zinc-900/50"
                                >

                                    <TableCell className="font-medium text-zinc-300">
                                        TKT-{ticket.id}
                                    </TableCell>

                                    <TableCell className="text-zinc-300">
                                        {ticket.customer?.name || "Unknown"}
                                    </TableCell>

                                    <TableCell className="text-zinc-400">
                                        {ticket.subject || "No Subject"}
                                    </TableCell>

                                    <TableCell>
                                        <span
                                            className={`text-sm font-medium ${getPriorityClass(
                                                ticket.priority
                                            )}`}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        {getStatusBadge(ticket.status)}
                                    </TableCell>

                                    <TableCell className="text-right">

                                        <Button
                                            size="sm"
                                            className="bg-white text-black hover:bg-zinc-200"
                                            onClick={() =>
                                                navigate(
                                                    `/tickets/${ticket.id}`
                                                )
                                            }
                                        >
                                            Review Ticket
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                )}

            </Card>

        </div>
    );
}