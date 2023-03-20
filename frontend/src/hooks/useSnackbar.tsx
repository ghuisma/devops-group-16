import { IconButton, Snackbar as SnackbarBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useState } from "react";

export const useSnackbar = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>();

    const openSnackbar = useCallback((message: string) => {
        setMessage(message);
        setOpen(true);
    }, []);

    const Snackbar = useCallback(
        () => (
            <SnackbarBase
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message={message}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                action={
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                }
            />
        ),
        [message, open]
    );

    return {
        Snackbar,
        openSnackbar,
    };
};
