import { NEXT_PUBLIC_API_URL } from "@/config";
import { useSnackbar } from "@/hooks";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";

export type AnswerQuestionBody = {
    answer: string;
};

export default function QuestionPage() {
    const router = useRouter();
    const { questionId } = router.query;
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<AnswerQuestionBody>({
        defaultValues: {
            answer: "",
        },
    });
    const { Snackbar, openSnackbar } = useSnackbar();
    const onSubmit = async (body: AnswerQuestionBody) => {
        try {
            const response = await fetch(
                `${NEXT_PUBLIC_API_URL}/answers/${questionId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
            if (response.ok) {
                openSnackbar("Response has been saved!");
                reset();
            } else {
                throw new Error("Could not save response. Please try again!");
            }
        } catch (err) {
            openSnackbar(
                err instanceof Error
                    ? err.message
                    : "Could not save response. Please try again!"
            );
        }
    };

    return (
        <Box
            sx={{
                bgcolor: "primary.main",
                height: "100vh",
                padding: (theme) => theme.spacing(2),
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: (theme) => theme.spacing(2),
            }}
        >
            <Snackbar />
            <Card
                sx={{
                    maxWidth: "sm",
                    width: "100%",
                    padding: (theme) => theme.spacing(2),
                }}
            >
                <Typography variant="h6" component="h1">
                    {questionId}
                </Typography>
            </Card>
            <Card
                sx={{
                    maxWidth: "sm",
                    width: "100%",
                    padding: (theme) => theme.spacing(2),
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: (theme) => theme.spacing(2),
                    }}
                >
                    <Controller
                        name="answer"
                        control={control}
                        rules={{ required: "Please answer the question" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="outlined"
                                label="Your answer"
                                error={Boolean(errors.answer)}
                                helperText={errors.answer?.message}
                                multiline
                                minRows={6}
                            />
                        )}
                    />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
