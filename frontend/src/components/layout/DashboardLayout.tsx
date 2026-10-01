import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, Briefcase, ShoppingCart, Ticket, MessageSquare, History, Settings, LogOut } from "lucide-react";import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { role, logout } = useAuth();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    // Define which roles can see which links
    const allNavItems = [
        { name: "Admin Panel", path: "/admin", icon: LayoutDashboard, allowedRoles: ["ADMIN"] },
        { name: "Users", path: "/users", icon: Users, allowedRoles: ["ADMIN"] },
        { name: "Customers", path: "/customers", icon: UserCheck, allowedRoles: ["ADMIN", "SUPPORT_AGENT"] },
        { name: "Agent Workspace", path: "/agent", icon: Briefcase, allowedRoles: ["ADMIN", "SUPPORT_AGENT"] },
        { name: "Orders", path: "/orders", icon: ShoppingCart, allowedRoles: ["ADMIN", "SUPPORT_AGENT", "CUSTOMER"] },
        { name: "Tickets", path: "/tickets", icon: Ticket, allowedRoles: ["ADMIN", "SUPPORT_AGENT", "CUSTOMER"] },
        { name: "Chat History", path: "/history", icon: History, allowedRoles: ["ADMIN", "SUPPORT_AGENT", "CUSTOMER"] },
        { name: "AI Chat", path: "/chat", icon: MessageSquare, allowedRoles: ["ADMIN", "SUPPORT_AGENT", "CUSTOMER"] },
        { name: "Settings", path: "/settings", icon: Settings, allowedRoles: ["ADMIN"] },
    ];

    // Filter links based on the current user's role
    const visibleNavItems = allNavItems.filter(item =>
        role && item.allowedRoles.includes(role)
    );

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white font-sans">
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-10">
                    <div className="h-8 w-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                        <span className="text-zinc-900 font-bold text-xl leading-none">N</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">Nexa</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                                    isActive ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-zinc-950/50">
                    <div className="ml-auto flex items-center gap-4">
                        <Settings className="h-5 w-5 text-zinc-400 hover:text-zinc-100 cursor-pointer transition-colors" />
                        <div className="flex items-center justify-center h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-300">
                            {role || "GUEST"}
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}