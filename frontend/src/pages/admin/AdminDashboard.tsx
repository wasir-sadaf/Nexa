import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import {
    Users,
    Ticket,
    UserCheck,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface TicketData {
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
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, ticketsResponse] =
                    await Promise.all([
                        axios.get("http://localhost:8080/api/users"),
                        axios.get("http://localhost:8080/api/tickets"),
                    ]);

                setUsers(usersResponse.data);
                setTickets(ticketsResponse.data);
                setError("");
            } catch (error) {
                console.error(
                    "Failed to load admin dashboard:",
                    error
                );

                setError(
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalUsers = users.length;

    const totalAgents = users.filter(
        (user) => user.role === "SUPPORT_AGENT"
    ).length;

    const activeTickets = tickets.filter(
        (ticket) =>
            ticket.status === "OPEN" ||
            ticket.status === "IN_PROGRESS" ||
            ticket.status === "ESCALATED"
    ).length;

    const recentTickets = [...tickets]
        .sort(
            (a, b) =>
                new Date(b.lastUpdated || b.createdAt).getTime() -
                new Date(a.lastUpdated || a.createdAt).getTime()
        )
        .slice(0, 5);

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return "-";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "OPEN":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        Open
                    </Badge>
                );

            case "IN_PROGRESS":
                return (
                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                        In Progress
                    </Badge>
                );

            case "ESCALATED":
                return (
                    <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                        Escalated
                    </Badge>
                );

            case "RESOLVED":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                        Resolved
                    </Badge>
                );

            case "CLOSED":
                return (
                    <Badge className="bg-zinc-800 text-zinc-400">
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

    if (loading) {
        return (
            <div className="space-y-8 text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Overview
                    </h1>

                    <p className="text-zinc-400 mt-1">
                        Manage your platform metrics and users.
                    </p>
                </div>

                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-zinc-400">
                        Loading dashboard...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 text-white">

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Admin Overview
                </h1>

                <p className="text-zinc-400 mt-1">
                    Manage your platform metrics and users.
                </p>
            </div>

            {error && (
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-red-400">
                        {error}
                    </p>
                </Card>
            )}

            {/* Metrics */}
            <div className="grid gap-6 md:grid-cols-3">

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Total Users
                        </CardTitle>

                        <Users className="h-4 w-4 text-zinc-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalUsers}
                        </div>

                        <p className="text-xs text-zinc-500 mt-1">
                            Registered users
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Active Support Tickets
                        </CardTitle>

                        <Ticket className="h-4 w-4 text-zinc-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {activeTickets}
                        </div>

                        <p className="text-xs text-zinc-500 mt-1">
                            Open, in progress, or escalated
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">
                            Support Agents
                        </CardTitle>

                        <UserCheck className="h-4 w-4 text-zinc-500" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalAgents}
                        </div>

                        <p className="text-xs text-zinc-500 mt-1">
                            Registered support agents
                        </p>
                    </CardContent>
                </Card>

            </div>

            {/* Recent Tickets */}
            <div className="space-y-4">

                <h2 className="text-xl font-semibold tracking-tight">
                    Recent Support Tickets
                </h2>

                <Card className="bg-zinc-950 border-zinc-800">

                    {recentTickets.length === 0 ? (
                        <CardContent>
                            <p className="text-center text-zinc-500 py-8">
                                No support tickets found.
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
                                        Status
                                    </TableHead>

                                    <TableHead className="text-right text-zinc-400">
                                        Last Updated
                                    </TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {recentTickets.map((ticket) => (
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
                                            {getStatusBadge(ticket.status)}
                                        </TableCell>

                                        <TableCell className="text-right text-zinc-500">
                                            {formatDate(
                                                ticket.lastUpdated ||
                                                ticket.createdAt
                                            )}
                                        </TableCell>

                                    </TableRow>
                                ))}

                            </TableBody>

                        </Table>
                    )}

                </Card>

            </div>

        </div>
    );
}