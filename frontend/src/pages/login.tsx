import { useAuth } from "@/hooks";
import { UserCredentials } from "@/providers";
import styles from "@/styles/Login.module.css";
import { Button, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Login() {
    const router = useRouter();
    const { token, login } = useAuth();
    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm<UserCredentials>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token]);

    const onSubmit = async (data: UserCredentials) => {
        try {
            await login(data);
        } catch (err) {
            setError("username", {});
            setError("password", {
                message:
                    err instanceof Error
                        ? err.message
                        : "Invalid user credentials",
            });
        }
    };

    return (
        <main className={styles.main}>
            <Paper className={styles.paper}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: "Username is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="Username"
                                error={Boolean(errors.username)}
                                helperText={errors.username?.message}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Password is required",
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="Password"
                                error={Boolean(errors.password)}
                                helperText={errors.password?.message}
                                type="password"
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        className={styles.mb}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
                <Typography variant="body2" className={styles.registerText}>
                    No account yet?{" "}
                    {
                        <Link href="/register" className={styles.link}>
                            Register here!
                        </Link>
                    }
                </Typography>
            </Paper>
        </main>
    );
}
