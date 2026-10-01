import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ConversationsPage() {
    const history = [
        { id: "CHT-5501", handler: "Nexa AI", snippet: "How do I reset my database password?", date: "Today, 10:45 AM" },
        { id: "CHT-5489", handler: "Alice (Support)", snippet: "Your billing issue has been resolved.", date: "Sep 28, 2026" },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Conversation History</h1>
                <p className="text-zinc-400 mt-1">Review past support chats and AI interactions.</p>
            </div>
            <Card className="bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400 w-12"></TableHead>
                            <TableHead className="text-zinc-400">Chat ID</TableHead>
                            <TableHead className="text-zinc-400">Handled By</TableHead>
                            <TableHead className="text-zinc-400">Last Message</TableHead>
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((chat) => (
                            <TableRow key={chat.id} className="border-zinc-800 hover:bg-zinc-900/50 cursor-pointer">
                                <TableCell>
                                    <MessageCircle className="h-4 w-4 text-zinc-500" />
                                </TableCell>
                                <TableCell className="font-medium text-zinc-300">{chat.id}</TableCell>
                                <TableCell className="text-zinc-400">{chat.handler}</TableCell>
                                <TableCell className="text-zinc-300 truncate max-w-[200px]">{chat.snippet}</TableCell>
                                <TableCell className="text-zinc-500">{chat.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                                        Read Log
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