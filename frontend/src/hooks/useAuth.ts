import { useContext } from "react";
import { AuthContext } from "@/providers";

export const useAuth = () => {
    const { token, isLoading, register, login, logout } =
        useContext(AuthContext);

    return {
        token,
        isLoading,
        register,
        login,
        logout,
    };
};
