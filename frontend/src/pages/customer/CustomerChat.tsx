import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

export default function CustomerChat() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 text-white">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
                <p className="text-zinc-400 mt-1">Ask questions or request support from Nexa AI.</p>
            </div>

            <Card className="flex-1 flex flex-col bg-zinc-950 border-zinc-800 overflow-hidden">
                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* AI Message */}
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <Bot className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <p className="text-sm font-medium text-emerald-500">Nexa AI</p>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm p-3 text-zinc-300 text-sm inline-block max-w-[80%]">
                                Hello! How can I help you with your account today?
                            </div>
                        </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                            <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1 flex flex-col items-end space-y-1.5">
                            <p className="text-sm font-medium text-blue-500">You</p>
                            <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-3 text-white text-sm inline-block max-w-[80%]">
                                I need help resetting my database password.
                            </div>
                        </div>
                    </div>

                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
                    <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            placeholder="Type your message..."
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700 h-10"
                        />
                        <Button type="submit" className="bg-white text-black hover:bg-zinc-200 h-10 px-6">
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}