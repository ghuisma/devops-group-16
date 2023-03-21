import {
    useIsMobile
} from "@/hooks";
import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    DialogActions,
    IconButton,
} from "@mui/material";
import { useQRCode } from "next-qrcode";

export type QrDialogProps = {
    open: boolean;
    onClose: () => void;
    link: string;
};

export const QrDialog = ({ open, onClose, link }: QrDialogProps) => {
    const isMobile = useIsMobile();
    const { Canvas } = useQRCode();

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullScreen={isMobile}
                maxWidth="md">
                <DialogActions>
                    <IconButton
                        component="div"
                        size="large"
                        onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <Canvas 
                    text={link}
                    options={{
                        level: 'M',
                        margin: 3,
                        scale: 4,
                        width: 500,
                        color: {
                        dark: '#010599FF',
                        light: '#FFFFFF',
                        },
                    }}/>
            </Dialog>
        </>
    );
};
