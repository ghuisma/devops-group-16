import { useAuth } from "@/hooks";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token]);

    if (!token) {
        return null;
    }

    return <>{children}</>;
};
