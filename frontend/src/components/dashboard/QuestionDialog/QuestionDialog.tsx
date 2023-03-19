import { CreateQuestionBody, useIsMobile, useQuestions } from "@/hooks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export type QuestionDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const QuestionDialog = ({ open, onClose }: QuestionDialogProps) => {
    const { createQuestion } = useQuestions();
    const isMobile = useIsMobile();
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<CreateQuestionBody>({
        defaultValues: {
            question: "",
        },
    });

    const onSubmit = async (body: CreateQuestionBody) => {
        try {
            createQuestion(body);
            handleClose();
        } catch (err) {
            // TODO: display error message
        }
    };

    const handleClose = () => {
        onClose();
        reset();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            fullWidth
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>New Question</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: (theme) => theme.spacing(2) }}>
                        What do you want to know?
                    </DialogContentText>
                    <Controller
                        name="question"
                        control={control}
                        rules={{ required: "Question is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                autoFocus
                                margin="dense"
                                label="Question"
                                fullWidth
                                variant="outlined"
                                multiline
                                minRows={4}
                                error={Boolean(errors.question)}
                                helperText={errors.question?.message}
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
