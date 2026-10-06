import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchAgents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/users",
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("USERS RESPONSE:", response.data);

            const supportAgents = response.data.filter(
                (user: User) => user.role === "SUPPORT_AGENT"
            );

            setAgents(supportAgents);
            setError("");
        } catch (error: any) {
            console.error("LOAD AGENTS ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);

            setError(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to load support agents."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleCreateAgent = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setCreating(true);

            const response = await axios.post(
                "http://localhost:8080/api/users",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    role: "SUPPORT_AGENT",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("AGENT CREATED:", response.data);

            setName("");
            setEmail("");
            setPassword("");
            setShowForm(false);
            setSuccess("Support agent created successfully.");

            await fetchAgents();
        } catch (error: any) {
            console.error("CREATE AGENT ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);

            const backendError =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.response?.data;

            if (typeof backendError === "string") {
                setError(backendError);
            } else {
                setError(
                    `Failed to create support agent (${
                        error.response?.status || "unknown error"
                    }).`
                );
            }
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Support Agents
                    </h1>

                    <p className="text-zinc-400 mt-1">
                        Manage your support agents.
                    </p>
                </div>

                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <p className="text-zinc-400">
                        Loading support agents...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Support Agents
                    </h1>

                    <p className="text-zinc-400 mt-1">
                        Manage your support agents.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setShowForm(!showForm);
                        setError("");
                        setSuccess("");
                    }}
                    className="bg-white text-black hover:bg-zinc-200"
                >
                    {showForm ? "Cancel" : "Add Support Agent"}
                </Button>
            </div>

            {success && (
                <Card className="bg-zinc-950 border-zinc-800 p-4">
                    <p className="text-emerald-400">{success}</p>
                </Card>
            )}

            {error && (
                <Card className="bg-zinc-950 border-red-900 p-4">
                    <p className="text-red-400 whitespace-pre-wrap">
                        {error}
                    </p>
                </Card>
            )}

            {showForm && (
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold">
                            Create Support Agent
                        </h2>

                        <p className="text-sm text-zinc-400 mt-1">
                            Create an account that can access the Agent
                            Workspace.
                        </p>
                    </div>

                    <form
                        onSubmit={handleCreateAgent}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Name
                            </label>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Agent name"
                                className="bg-zinc-900 border-zinc-800 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Email
                            </label>

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="agent@example.com"
                                className="bg-zinc-900 border-zinc-800 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">
                                Password
                            </label>

                            <Input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Password"
                                className="bg-zinc-900 border-zinc-800 text-white"
                            />
                        </div>

                        <div className="md:col-span-3 flex justify-end">
                            <Button
                                type="submit"
                                disabled={creating}
                                className="bg-white text-black hover:bg-zinc-200"
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Support Agent"}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="bg-zinc-950 border-zinc-800">
                {agents.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500">
                        No support agents found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">
                                    ID
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Name
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Email
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Role
                                </TableHead>

                                <TableHead className="text-zinc-400">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {agents.map((agent) => (
                                <TableRow
                                    key={agent.id}
                                    className="border-zinc-800 hover:bg-zinc-900/50"
                                >
                                    <TableCell className="font-medium text-zinc-300">
                                        AG-{agent.id}
                                    </TableCell>

                                    <TableCell className="text-zinc-300">
                                        {agent.name}
                                    </TableCell>

                                    <TableCell className="text-zinc-400">
                                        {agent.email}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="border-zinc-700 text-zinc-300 bg-zinc-900"
                                        >
                                            SUPPORT AGENT
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-emerald-500 text-sm">
                                            Active
                                        </span>
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