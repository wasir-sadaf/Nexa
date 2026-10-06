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

interface Customer {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/users")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch customers");
                }
                return response.json();
            })
            .then((users: Customer[]) => {
                const customerUsers = users.filter(
                    (user) => user.role === "CUSTOMER"
                );

                setCustomers(customerUsers);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load customers.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Customers
                </h1>
                <p className="text-zinc-400 mt-1">
                    Directory of registered platform customers.
                </p>
            </div>

            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">
                                Customer ID
                            </TableHead>
                            <TableHead className="text-zinc-400">
                                Name
                            </TableHead>
                            <TableHead className="text-zinc-400">
                                Email
                            </TableHead>
                            <TableHead className="text-zinc-400">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-zinc-400 py-8"
                                >
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && error && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-red-400 py-8"
                                >
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && !error && customers.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-zinc-400 py-8"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            !error &&
                            customers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="border-zinc-800 hover:bg-zinc-900/50"
                                >
                                    <TableCell className="font-medium text-zinc-300">
                                        {customer.id}
                                    </TableCell>

                                    <TableCell className="text-white">
                                        {customer.name}
                                    </TableCell>

                                    <TableCell className="text-zinc-400">
                                        {customer.email}
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-green-400">
                                            Active
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}