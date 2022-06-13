module.exports = {
    extends: ['next/core-web-vitals', '@ruffpuff'],
    rules: {
        '@typescript-eslint/no-extra-parens': 'off'
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    }
};
