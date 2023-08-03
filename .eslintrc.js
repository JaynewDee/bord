module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // Use TypeScript recommended rules
        'plugin:react/recommended', // Use React recommended rules
        'plugin:react-hooks/recommended', // Use React Hooks rules
    ],
    rules: {
        semi: 'off', // Disable the semi rule to forbid semicolons at the end of lines
        '@typescript-eslint/semi': ['error', 'never'], // Apply the no semicolons rule for TypeScript files
    },
};