import useSwr from "swr";
import { useAuth } from "./useAuth";
import { Question } from "./useQuestions";

export type Answer = {
    answer: string;
    questionId: string;
    uid: string;
};

export type Answers = Answer[];

export const useAnswers = (questionId?: string) => {
    const { token } = useAuth();
    const { data, error, isLoading } = useSwr<Question & { answers: Answers }>(
        token && questionId
            ? [
                  `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`,
                  token,
              ]
            : null,
        ([key, token]: [string, string]) =>
            fetch(key, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }).then((res) => res.json())
    );

    return {
        answers: data?.answers,
        error,
        isLoading,
    };
};
