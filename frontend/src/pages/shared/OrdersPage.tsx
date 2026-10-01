import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
    const orders = [
        { id: "ORD-7032", customer: "Alex Mercer", amount: "$120.00", status: "Completed", date: "Oct 1, 2026" },
        { id: "ORD-7033", customer: "Taylor Swift", amount: "$89.99", status: "Processing", date: "Oct 1, 2026" },
        { id: "ORD-7034", customer: "Jordan Lee", amount: "$250.50", status: "Cancelled", date: "Sep 28, 2026" },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-zinc-400 mt-1">Review transaction history and order statuses.</p>
            </div>
            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Order ID</TableHead>
                            <TableHead className="text-zinc-400">Customer</TableHead>
                            <TableHead className="text-zinc-400">Amount</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400 text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-300">{order.id}</TableCell>
                                <TableCell className="text-zinc-400">{order.customer}</TableCell>
                                <TableCell className="text-zinc-300">{order.amount}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            order.status === "Completed" ? "border-emerald-500/50 text-emerald-500" :
                                                order.status === "Processing" ? "border-blue-500/50 text-blue-500" :
                                                    "border-rose-500/50 text-rose-500"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-zinc-500">{order.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}