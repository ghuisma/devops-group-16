import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
// import { expect } from '@storybook/jest';
import { AppBase } from "@/pages/_app";
import LoginPage from "@/pages/login";

const token = "VerysecureJWTToken";

export default {
    title: "Login Page",
    component: LoginPage,
    parameters: {
        controls: { hideNoControlsWarning: true },
    },
} as ComponentMeta<typeof LoginPage>;

const Template: ComponentStory<typeof LoginPage> = () => (
    <AppBase>
        <LoginPage />
    </AppBase>
);

export const Success = Template.bind({});

Success.parameters = {
    mockData: [
        {
            url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            method: "POST",
            status: 200,
            response: { token },
        },
    ],
};

Success.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const usernameInput = canvas.getByLabelText("Username", {
        selector: "input",
    });

    await userEvent.type(usernameInput, "testuser", {
        delay: 100,
    });

    const passwordInput = canvas.getByLabelText("Password", {
        selector: "input",
    });

    await userEvent.type(passwordInput, "ExamplePassword", {
        delay: 100,
    });
    // See https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    const submitButton = canvas.getByRole("button");

    await userEvent.click(submitButton);

    // TODO: expect Next.js router push to "/"
};

export const IncorrectCredentials = Template.bind({});

IncorrectCredentials.parameters = {
    mockData: [
        {
            url: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            method: "POST",
            status: 403,
            response: { message: "Incorrect user credentials" },
        },
    ],
};

// TODO: input validation failing plays + incorrect credentials play
