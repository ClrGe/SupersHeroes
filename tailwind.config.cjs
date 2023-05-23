const config = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],

    theme: {
        extend: {},
    },

    plugins: [
        require('flowbite/plugin'),
        require('./start/tailwind/index.cjs')
    ],
    darkMode: 'class',
};
module.exports = config
