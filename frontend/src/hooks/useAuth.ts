import { useContext } from "react";
import { AuthContext } from "@/providers";

export const useAuth = () => {
    const { token, register, login, logout } = useContext(AuthContext);

    return {
        token,
        register,
        login,
        logout,
    };
};
