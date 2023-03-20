import {
    DashboardFab,
    DashboardNavBar,
    ProtectedRoute,
    QuestionDialog,
} from "@/components";
import CopyIcon from "@mui/icons-material/CopyAll";
import DownloadIcon from "@mui/icons-material/Download";
import { Question, useToggle } from "@/hooks";
import {
    Box,
    Card,
    CardActionArea,
    IconButton,
    Typography,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import { useState } from "react";
import { useAnswers } from "@/hooks";

const toCSV = (arr: string[][]) => {
    if (!arr.length) return "";
    const [first, ...rest] = arr;
    return rest.reduce(
        (csv, text) => `${csv}\n${'"' + text.join('","') + '"'}`,
        '"' + first.join('","') + '"'
    );
};

export default function Dashboard() {
    const [activeQuestion, setActiveQuestion] = useState<Question>();
    const { answers } = useAnswers(activeQuestion?.uid);
    const [createDialogOpen, toggleCreateDialogOpen] = useToggle(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ProtectedRoute>
            <DashboardNavBar
                activeQuestion={activeQuestion}
                onQuestionClick={setActiveQuestion}
            >
                <QuestionDialog
                    open={createDialogOpen}
                    onClose={toggleCreateDialogOpen}
                />
                <DashboardFab onClick={toggleCreateDialogOpen} />
                {activeQuestion && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: (theme) => theme.spacing(3),
                        }}
                    >
                        <Card sx={{ width: "fit-content" }}>
                            <CardActionArea
                                onClick={() =>
                                    handleCopy(
                                        `${process.env.NEXT_PUBLIC_APP_URL}/q/${activeQuestion.uid}`
                                    )
                                }
                            >
                                <Box
                                    sx={{
                                        padding: (theme) => theme.spacing(2),
                                    }}
                                >
                                    <Typography variant="h6" component="p">
                                        Share
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography>
                                            {process.env.NEXT_PUBLIC_APP_URL}/q/
                                            {activeQuestion.uid}
                                        </Typography>
                                        <IconButton
                                            component="div"
                                            size="large"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleCopy(
                                                    `${process.env.NEXT_PUBLIC_APP_URL}/q/${activeQuestion.uid}`
                                                );
                                            }}
                                        >
                                            <CopyIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                        {Boolean(answers?.length) && (
                            <Card sx={{ width: "fit-content" }}>
                                <Box
                                    sx={{
                                        padding: (theme) => theme.spacing(2),
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="p"
                                        sx={{ flexGrow: 1 }}
                                    >
                                        Answers
                                    </Typography>
                                    <IconButton
                                        size="large"
                                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                                            toCSV(
                                                answers?.map(({ answer }) => [
                                                    answer,
                                                ]) ?? []
                                            )
                                        )}`}
                                        download={`${activeQuestion.uid}.csv`}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {answers?.map(({ answer, uid }) => (
                                                <TableRow
                                                    key={uid}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell>
                                                        {answer}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        )}
                    </Box>
                )}
            </DashboardNavBar>
        </ProtectedRoute>
    );
}
