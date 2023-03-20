import { AuthProvider } from "@/providers";
import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNode } from "react";

type AppBaseProps = {
    children: ReactNode;
};

export const AppBase = ({ children }: AppBaseProps) => {
    return (
        <>
            <CssBaseline />
            <CssVarsProvider>
                <AuthProvider>{children}</AuthProvider>
            </CssVarsProvider>
        </>
    );
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>One Question Survey App</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppBase>
                <Component {...pageProps} />
            </AppBase>
        </>
    );
}
