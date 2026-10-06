import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface Customer {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Order {
    id: number;
    customer: Customer;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: number;
    createdAt: string;
}

export default function OrdersPage() {
    const { role } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                let url = "http://localhost:8080/api/orders";

                if (role === "CUSTOMER") {
                    const userId = localStorage.getItem("userId");

                    if (!userId) {
                        throw new Error(
                            "User ID not found. Please log in again."
                        );
                    }

                    url = `http://localhost:8080/api/orders/customer/${userId}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await response.json();

                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        if (role) {
            fetchOrders();
        }
    }, [role]);

    const getStatusClass = (status: Order["status"]) => {
        switch (status) {
            case "DELIVERED":
                return "border-emerald-500/50 text-emerald-500";
            case "SHIPPED":
                return "border-blue-500/50 text-blue-500";
            case "PROCESSING":
                return "border-yellow-500/50 text-yellow-500";
            case "PENDING":
                return "border-zinc-500/50 text-zinc-400";
            case "CANCELLED":
                return "border-rose-500/50 text-rose-500";
            default:
                return "border-zinc-500/50 text-zinc-400";
        }
    };

    const formatStatus = (status: Order["status"]) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const pageTitle = role === "CUSTOMER" ? "My Orders" : "Orders";

    const pageDescription =
        role === "CUSTOMER"
            ? "View your order history and statuses."
            : "Review transaction history and order statuses.";

    if (loading) {
        return (
            <div className="space-y-6 text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {pageDescription}
                    </p>
                </div>

                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-zinc-400">
                        Loading orders...
                    </p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {pageDescription}
                    </p>
                </div>

                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-rose-500">
                        {error}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {pageTitle}
                </h1>
                <p className="text-zinc-400 mt-1">
                    {pageDescription}
                </p>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
                {orders.length === 0 ? (
                    <div className="p-6">
                        <p className="text-zinc-400">
                            No orders found.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">
                                    Order ID
                                </TableHead>

                                {role !== "CUSTOMER" && (
                                    <TableHead className="text-zinc-400">
                                        Customer
                                    </TableHead>
                                )}

                                <TableHead className="text-zinc-400">
                                    Amount
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Status
                                </TableHead>

                                <TableHead className="text-zinc-400 text-right">
                                    Date
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="border-zinc-800 hover:bg-zinc-900/50"
                                >
                                    <TableCell className="font-medium text-zinc-300">
                                        #{order.id}
                                    </TableCell>

                                    {role !== "CUSTOMER" && (
                                        <TableCell className="text-zinc-300">
                                            {order.customer?.name || "Unknown"}
                                        </TableCell>
                                    )}

                                    <TableCell className="text-zinc-300">
                                        ${Number(order.totalAmount).toFixed(2)}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={getStatusClass(
                                                order.status
                                            )}
                                        >
                                            {formatStatus(order.status)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right text-zinc-500">
                                        {formatDate(order.createdAt)}
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