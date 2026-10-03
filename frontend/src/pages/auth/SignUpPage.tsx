import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
    const navigate = useNavigate();

    // 1. Add state to track the user's input
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        try {
            // 2. Send the registration request to Spring Boot
            await axios.post("http://localhost:8080/api/auth/register", {
                name: name,
                email: email,
                password: password
            });

            // 3. Navigate to login on success
            navigate("/login");
        } catch (error: any) {
            console.error("Signup failed:", error);
            setErrorMessage(error.response?.data?.error || "Failed to register account.");
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
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your details to get started with Nexa
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSignUp}>
                    <CardContent className="space-y-4">
                        {errorMessage && (
                            <div className="text-red-500 text-sm font-medium text-center bg-red-500/10 p-2 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-zinc-300">
                                Full Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@nexa.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-11 focus-visible:ring-zinc-700"
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-4">
                        <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-11 text-md font-medium">
                            Sign Up
                        </Button>
                        <div className="text-sm text-center text-zinc-400">
                            Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}