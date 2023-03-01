import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

var testVariable = "Nice sentence";

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'Button',
  onClick: () => testVariable = "Working Test"
};
Primary.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button'));

  // 👇 Assert DOM structure
  await expect(
    testVariable === "Working Test"
  )
};
