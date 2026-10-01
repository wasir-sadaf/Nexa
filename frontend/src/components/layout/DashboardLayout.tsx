import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut } from "lucide-react";

export default function DashboardLayout() {
    const location = useLocation();

    const navItems = [
        { name: "Admin Panel", path: "/admin", icon: LayoutDashboard },
        { name: "Agent Queue", path: "/agent", icon: Users },
        { name: "AI Chat", path: "/chat", icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <div className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                        <span className="text-zinc-900 font-bold text-xl leading-none">N</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Nexa</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                                    isActive
                                        ? "bg-zinc-800 text-zinc-100"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-zinc-800">
                    <Link
                        to="/login"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-zinc-950/50">
                    <div className="ml-auto flex items-center gap-4">
                        <Settings className="h-5 w-5 text-zinc-400 hover:text-zinc-100 cursor-pointer transition-colors" />
                        <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}