import { useAuth, useSnackbar } from "@/hooks";
import { UserInfo } from "@/providers";
import styles from "@/styles/Login.module.css";

import { Button, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Register() {
    const router = useRouter();
    const { token, login, register } = useAuth();
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<UserInfo>({
        defaultValues: {
            username: "",
            password: "",
            repeat_password: "",
            email: "",
            first_name: "",
            last_name: "",
        },
    });
    const { Snackbar, openSnackbar } = useSnackbar();

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token]);

    const onSubmit = async (data: UserInfo) => {
        try {
            await register(data);
            await login({ username: data.username, password: data.password });
        } catch (err) {
            openSnackbar(
                err instanceof Error
                    ? err.message
                    : "Failed to create new account"
            );
        }
    };

    return (
        <main className={styles.main}>
            <Snackbar />
            <Paper className={styles.paper}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="first_name"
                        control={control}
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="First name"
                                error={Boolean(errors.first_name)}
                                helperText={errors.first_name?.message}
                            />
                        )}
                    />
                    <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="Last name"
                                error={Boolean(errors.last_name)}
                                helperText={errors.last_name?.message}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                message: "Please enter a valid email",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="Email"
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
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
                            pattern: {
                                value: /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                                message: "Use at least 8 characters, 1 special character, 1 uppercase letter, 1 lowercase letter and 1 number",
                            },
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
                    <Controller
                        name="repeat_password"
                        control={control}
                        rules={{
                            required: "Please repeat the password",
                            validate: (value, formvalues) => {
                                if (value !== formvalues.password) {
                                    return "Please repeat the password";
                                }
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                className={styles.mb}
                                label="Repeat password"
                                error={Boolean(errors.repeat_password)}
                                helperText={errors.repeat_password?.message}
                                type="password"
                            />
                        )}
                    />
                    <Button
                        variant="contained"
                        className={styles.mb}
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
                <Typography variant="body2" className={styles.registerText}>
                    Already have an account?{" "}
                    {
                        <Link href="/login" className={styles.link}>
                            Login here!
                        </Link>
                    }
                </Typography>
            </Paper>
        </main>
    );
}
