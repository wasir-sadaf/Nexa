import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
    const customers = [
        { id: "CST-091", name: "Alex Mercer", email: "alex@example.com", totalOrders: 12, status: "Active" },
        { id: "CST-092", name: "Taylor Swift", email: "taylor@example.com", totalOrders: 5, status: "Active" },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                <p className="text-zinc-400 mt-1">Directory of registered platform customers.</p>
            </div>
            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Customer ID</TableHead>
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Total Orders</TableHead>
                            <TableHead className="text-zinc-400 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((c) => (
                            <TableRow key={c.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-300">{c.id}</TableCell>
                                <TableCell>{c.name}</TableCell>
                                <TableCell className="text-zinc-400">{c.email}</TableCell>
                                <TableCell className="text-zinc-400">{c.totalOrders}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                        View Profile
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