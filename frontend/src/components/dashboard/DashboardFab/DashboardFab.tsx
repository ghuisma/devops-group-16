import { useIsMobile } from "@/hooks";
import { Fab } from "@mui/material";
import { drawerWidth } from "../DashboardNavBar";
import AddIcon from "@mui/icons-material/Add";

export type DashboardFabProps = {
    onClick: () => void;
};

export const DashboardFab = ({ onClick }: DashboardFabProps) => {
    const isMobile = useIsMobile();

    return (
        <Fab
            color="secondary"
            variant={isMobile ? "circular" : "extended"}
            sx={{
                position: "fixed",
                top: isMobile ? undefined : 64 - 28,
                right: isMobile ? (theme) => theme.spacing(2) : undefined,
                bottom: isMobile ? (theme) => theme.spacing(2) : undefined,
                left: isMobile ? undefined : drawerWidth - 28,
                zIndex: (theme) => theme.zIndex.drawer + 2,
            }}
            onClick={onClick}
        >
            <AddIcon />
            {!isMobile && "Create"}
        </Fab>
    );
};
