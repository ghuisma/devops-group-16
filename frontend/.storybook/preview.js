export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

const localStorageResetDecorator = (Story) => {
    window.localStorage.clear();
    return <Story />;
};

export const decorators = [localStorageResetDecorator];
