import { NEXT_PUBLIC_API_URL } from "@/config";
import { createContext, ReactNode, useEffect, useState } from "react";

export type UserInfo = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    repeat_password: string;
};

export type UserCredentials = Pick<UserInfo, "username" | "password">;

type AuthContextValue = {
    token?: string;
    register: (userInfo: UserInfo) => Promise<void>;
    login: (credentials: UserCredentials) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
    register: async () => {},
    login: async () => {},
    logout: async () => {},
});

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token ?? undefined);
    }, []);

    const register = async (userInfo: UserInfo) => {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
        });
        if (response.ok) {
            await login({
                username: userInfo.username,
                password: userInfo.password,
            });
        } else {
            throw new Error("Failed to create new account");
        }
    };

    const login = async (userCredentials: UserCredentials) => {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userCredentials),
        });
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
            setToken(token);
        } else {
            throw new Error("Invalid user credentials");
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(undefined);
    };

    return (
        <AuthContext.Provider value={{ token, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
