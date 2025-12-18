"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
    username: string;
    role: string;
    joined: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user on mount
        const savedUser = localStorage.getItem("dna_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (username: string, password: string) => {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        // Mock login - accept any non-empty input
        const newUser: User = { username, role: "Researcher", joined: new Date().toISOString() };
        setUser(newUser);
        localStorage.setItem("dna_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("dna_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
