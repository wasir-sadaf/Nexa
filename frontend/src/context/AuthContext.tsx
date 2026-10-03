import { createContext, useContext, useState, ReactNode } from "react";

type Role = "ADMIN" | "SUPPORT_AGENT" | "CUSTOMER" | null;

interface AuthContextType {
    role: Role;
    login: (selectedRole: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // 1. Initialize state directly from localStorage so the app remembers you
    const [role, setRole] = useState<Role>(() => {
        return (localStorage.getItem("userRole") as Role) || null;
    });

    const login = (selectedRole: Role) => setRole(selectedRole);

    // 2. Ensure logout clears the browser storage too
    const logout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}