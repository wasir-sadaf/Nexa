import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
    const users = [
        { id: "USR-001", name: "Alice Freeman", email: "alice@nexa.com", role: "CUSTOMER", status: "Active" },
        { id: "USR-002", name: "Bob Smith", email: "bob@nexa.com", role: "SUPPORT_AGENT", status: "Active" },
        { id: "USR-003", name: "Charlie Davis", email: "charlie@nexa.com", role: "ADMIN", status: "Active" },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-zinc-400 mt-1">Manage system access and database roles.</p>
            </div>
            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Role</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-300">{user.name}</TableCell>
                                <TableCell className="text-zinc-400">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-zinc-900">{user.role}</Badge>
                                </TableCell>
                                <TableCell className="text-emerald-500 text-sm">{user.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}