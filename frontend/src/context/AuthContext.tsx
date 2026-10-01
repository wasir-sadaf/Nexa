import { createContext, useContext, useState, ReactNode } from "react";

type Role = "ADMIN" | "SUPPORT_AGENT" | "CUSTOMER" | null;

interface AuthContextType {
    role: Role;
    login: (selectedRole: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>(null);

    const login = (selectedRole: Role) => setRole(selectedRole);
    const logout = () => setRole(null);

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