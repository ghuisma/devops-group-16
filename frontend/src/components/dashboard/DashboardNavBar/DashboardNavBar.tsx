import { Question, useAuth, useQuestions, useToggle } from "@/hooks";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { ReactNode } from "react";

export const drawerWidth = 240;

export type DashboardNavBarProps = {
    children: ReactNode;
    activeQuestion?: Question;
    onQuestionClick: (question: Question) => void;
};

export const DashboardNavBar = ({
    children,
    activeQuestion,
    onQuestionClick,
}: DashboardNavBarProps) => {
    const { logout } = useAuth();
    const { questions } = useQuestions();
    const [mobileOpen, toggleMobileOpen] = useToggle(false);

    const drawer = (
        <>
            <Toolbar />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {questions?.map((questionObj) => (
                        <ListItem
                            key={questionObj.question}
                            disablePadding
                            onClick={() => onQuestionClick(questionObj)}
                        >
                            <ListItemButton
                                selected={
                                    questionObj.uid === activeQuestion?.uid
                                }
                            >
                                <ListItemText primary={questionObj.question} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    {Boolean(questions?.length) && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            sx={{
                                mr: 2,
                                display: { xs: "inherit", md: "none" },
                            }}
                            onClick={toggleMobileOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Dashboard
                    </Typography>
                    <IconButton size="large" color="inherit" onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {Boolean(questions?.length) && (
                <Box
                    component="nav"
                    sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={toggleMobileOpen}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: "block", md: "none" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: "none", md: "block" },
                            "& .MuiDrawer-paper": {
                                boxSizing: "border-box",
                                width: drawerWidth,
                            },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
            )}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: (theme) => theme.spacing(3),
                    ml: {
                        md: questions?.length ? `${drawerWidth}px` : undefined,
                    },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </>
    );
};
