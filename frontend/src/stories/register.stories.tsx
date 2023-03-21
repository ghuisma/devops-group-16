import { ComponentStory, ComponentMeta } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import Register from "@/pages/register";
import { AppBase } from "@/pages/_app";
import { expect } from "@storybook/jest";

export default {
  title: "Register page",
  component: Register,
} as ComponentMeta<typeof Register>;

const Template: ComponentStory<typeof Register> = () => (
  <AppBase>
    <Register />
  </AppBase>
);

export const RendersWithoutError = Template.bind({});

RendersWithoutError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const firstNameInput = canvas.getByLabelText("First name", {
    selector: "input",
  });

  await userEvent.type(firstNameInput, "testuser", {
    delay: 100,
  });

  const lastNameInput = canvas.getByLabelText("Last name", {
    selector: "input",
  });

  await userEvent.type(lastNameInput, "ExamplePassword", {
    delay: 100,
  });

  const emailInput = canvas.getByLabelText("Email", {
    selector: "input",
  });

  await userEvent.type(emailInput, "testuser", {
    delay: 100,
  });

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

  const repeatPasswordInput = canvas.getByLabelText("Repeat password", {
    selector: "input",
  });

  await userEvent.type(repeatPasswordInput, "ExamplePassword", {
    delay: 100,
  });

  const submitButton = canvas.getByRole("button");

  userEvent.click(submitButton);
};

export const InputValidationMail = Template.bind({});

InputValidationMail.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const firstNameInput = canvas.getByLabelText("First name", {
    selector: "input",
  });

  await userEvent.type(firstNameInput, "testuser", {
    delay: 100,
  });

  const lastNameInput = canvas.getByLabelText("Last name", {
    selector: "input",
  });

  await userEvent.type(lastNameInput, "ExamplePassword", {
    delay: 100,
  });

  const emailInput = canvas.getByLabelText("Email", {
    selector: "input",
  });

  await userEvent.type(emailInput, "invalidmail", {
    delay: 100,
  });

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

  const repeatPasswordInput = canvas.getByLabelText("Repeat password", {
    selector: "input",
  });

  await userEvent.type(repeatPasswordInput, "ExamplePassword", {
    delay: 100,
  });

  const submitButton = canvas.getByRole("button");

  await userEvent.click(submitButton);

  await expect(canvas.getByText("Please enter a valid email")).toBeInTheDocument();
};
