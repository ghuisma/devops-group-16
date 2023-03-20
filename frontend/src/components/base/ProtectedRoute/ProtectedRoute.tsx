import { useAuth } from "@/hooks";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const { token, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !token) {
            router.push("/login");
        }
    }, [token, isLoading]);

    if (!token) {
        return null;
    }

    return <>{children}</>;
};
