import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate role assignment based on the email entered
        if (email.includes("admin")) {
            login("ADMIN");
            navigate("/admin");
        } else if (email.includes("agent")) {
            login("SUPPORT_AGENT");
            navigate("/agent");
        } else {
            login("CUSTOMER");
            navigate("/chat");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans">
            <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-white shadow-2xl">
                <CardHeader className="space-y-1 text-center pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="h-10 w-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                            <span className="text-zinc-900 font-bold text-2xl leading-none">N</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Nexa</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Try: admin@, agent@, or anything else"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-4">
                        <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-11 text-md font-medium">
                            Sign In
                        </Button>
                        <div className="text-sm text-center text-zinc-400">
                            Don't have an account? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}