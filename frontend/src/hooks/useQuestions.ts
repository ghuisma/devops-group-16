import { NEXT_PUBLIC_API_URL } from "@/config";
import { useCallback } from "react";
import useSwr from "swr";
import { useAuth } from "./useAuth";

export type Question = {
    question: string;
    uid: string; // question id
    url: string;
};

export type Questions = Question[];

export type CreateQuestionBody = {
    question: string;
};

export const useQuestions = () => {
    const { token } = useAuth();
    const { data, error, isLoading, mutate } = useSwr<Questions>(
        token ? [`${NEXT_PUBLIC_API_URL}/questions`, token] : null,
        ([key, token]: [string, string]) =>
            fetch(key, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }).then((res) => res.json())
    );

    const createQuestion = useCallback(
        async (body: CreateQuestionBody) => {
            if (!token) return;
            const response = await fetch(`${NEXT_PUBLIC_API_URL}/questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                mutate();
            } else {
                throw new Error(
                    "Failed to create new question. Please try again!"
                );
            }
        },
        [token]
    );

    return {
        questions: data,
        error,
        isLoading,
        createQuestion,
    };
};
