import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";

const queue = [
    { id: "TKT-492", user: "Alex Mercer", issue: "Cannot access billing", status: "Waiting", time: "2m ago" },
    { id: "TKT-491", user: "Jordan Lee", issue: "API rate limit exceeded", status: "In Progress", time: "15m ago" },
    { id: "TKT-489", user: "Taylor Swift", issue: "Account upgrade request", status: "Waiting", time: "1h ago" },
];

export default function AgentDashboard() {
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
                        <CardTitle className="text-sm font-medium text-zinc-400">My Open Tickets</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">12</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">4m 32s</div></CardContent>
                </Card>
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Resolved Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">28</div></CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Ticket ID</TableHead>
                            <TableHead className="text-zinc-400">Customer</TableHead>
                            <TableHead className="text-zinc-400">Issue</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400">Wait Time</TableHead>
                            <TableHead className="text-right text-zinc-400">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queue.map((ticket) => (
                            <TableRow key={ticket.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-300">{ticket.id}</TableCell>
                                <TableCell>{ticket.user}</TableCell>
                                <TableCell className="text-zinc-400">{ticket.issue}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={ticket.status === "Waiting" ? "border-amber-500/50 text-amber-500" : "border-blue-500/50 text-blue-500"}>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-500">{ticket.time}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                                        Join Chat
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}