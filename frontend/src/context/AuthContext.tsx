import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "ADMIN" | "SUPPORT_AGENT" | "CUSTOMER" | null;

interface AuthContextType {
    role: Role;
    login: (selectedRole: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>(() => {
        return (localStorage.getItem("userRole") as Role) || null;
    });

    const login = (selectedRole: Role) => {
        setRole(selectedRole);

        if (selectedRole) {
            localStorage.setItem("userRole", selectedRole);
        } else {
            localStorage.removeItem("userRole");
        }
    };

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
