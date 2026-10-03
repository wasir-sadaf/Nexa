import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                email: email,
                password: password
            });

            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("userRole", response.data.role);

            if (login) {
                login(response.data.role);
            }

            // Navigate directly to the tickets page without a forced window reload
            navigate("/tickets");

        } catch (error: any) {
            console.error("Login failed with error:", error);
            setErrorMsg(error.response?.data?.error || "Invalid email or password.");
        } finally {
            setIsLoading(false);
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
                        {errorMsg && (
                            <div className="p-3 rounded bg-rose-500/10 border border-rose-500/50 text-rose-500 text-sm text-center">
                                {errorMsg}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email</label>
                            <Input
                                id="email" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@nexa.com"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-zinc-300">Password</label>
                            </div>
                            <Input
                                id="password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11"
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-4">
                        <Button disabled={isLoading} type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-11 text-md font-medium">
                            {isLoading ? "Signing in..." : "Sign In"}
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