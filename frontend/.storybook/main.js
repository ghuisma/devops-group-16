module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-mock",
        "storybook-addon-next",
    ],
    features: {
        interactionsDebugger: true,
    },
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-webpack5",
    },
    typescript: {
        check: false,
        checkOptions: {},
        reactDocgen: false,
    },
};
