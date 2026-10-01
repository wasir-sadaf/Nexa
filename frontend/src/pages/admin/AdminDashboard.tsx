import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Ticket, Activity } from "lucide-react";

const recentTickets = [
    { id: "TKT-492", user: "Alex Mercer", subject: "Cannot access billing", status: "Open", date: "Just now" },
    { id: "TKT-491", user: "Jordan Lee", subject: "API rate limit exceeded", status: "In Progress", date: "2 hours ago" },
    { id: "TKT-490", user: "Casey Smith", subject: "Password reset not working", status: "Resolved", date: "5 hours ago" },
    { id: "TKT-489", user: "Taylor Swift", subject: "Account upgrade request", status: "Open", date: "Yesterday" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                <p className="text-zinc-400 mt-1">Manage your platform metrics and users.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Metric Cards */}
                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,482</div>
                        <p className="text-xs text-emerald-500 mt-1">+14% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Active Support Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">342</div>
                        <p className="text-xs text-rose-500 mt-1">+8 since yesterday</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">System Uptime</CardTitle>
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-emerald-500 mt-1">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tickets Data Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Support Tickets</h2>
                <Card className="bg-zinc-950 border-zinc-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">Ticket ID</TableHead>
                                <TableHead className="text-zinc-400">User</TableHead>
                                <TableHead className="text-zinc-400">Subject</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400 text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTickets.map((ticket) => (
                                <TableRow key={ticket.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="font-medium text-zinc-300">{ticket.id}</TableCell>
                                    <TableCell>{ticket.user}</TableCell>
                                    <TableCell className="text-zinc-400">{ticket.subject}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ticket.status === "Resolved" ? "secondary" : "default"}
                                            className={ticket.status === "Open" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" :
                                                ticket.status === "In Progress" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" :
                                                    "bg-zinc-800 text-zinc-400"}
                                        >
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-zinc-500">{ticket.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}