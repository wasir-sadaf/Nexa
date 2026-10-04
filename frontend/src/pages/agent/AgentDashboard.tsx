import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Ticket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    customer?: { id: number; name?: string };
}

export default function AgentDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/tickets");
                setTickets(response.data);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        };

        fetchTickets();

        // Optional: Auto-refresh every 5 seconds for the presentation demo
        const interval = setInterval(fetchTickets, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ESCALATED":
                return <Badge className="bg-red-500/10 text-red-500 border-red-500/50 flex gap-1 items-center animate-pulse"><AlertCircle className="w-3 h-3"/> AI Escalated</Badge>;
            case "OPEN":
                return <Badge variant="outline" className="border-amber-500/50 text-amber-500">Open</Badge>;
            case "IN_PROGRESS":
                return <Badge variant="outline" className="border-blue-500/50 text-blue-500">In Progress</Badge>;
            case "RESOLVED":
            case "CLOSED":
                return <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">Resolved</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Workspace</h1>
                    <p className="text-zinc-400 mt-1">Manage your active support tickets and customer chats.</p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-3 py-1">
                        Status: Available
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Tickets</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{tickets.length}</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Escalations</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {tickets.filter(t => t.status === "ESCALATED").length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Resolved Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length}</div></CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Ticket ID</TableHead>
                            <TableHead className="text-zinc-400">Customer</TableHead>
                            <TableHead className="text-zinc-400">Subject / Issue</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-right text-zinc-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-300">TKT-{ticket.id}</TableCell>
                                <TableCell>{ticket.customer?.id ? `User ${ticket.customer.id}` : "Guest"}</TableCell>
                                <TableCell className="text-zinc-400">{ticket.subject || "No Subject"}</TableCell>
                                <TableCell>
                                    {getStatusBadge(ticket.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                                        Review Chat
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                                    No active tickets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}