module.exports = {
    extends: ['next/core-web-vitals', '@ruffpuff'],
    rules: {
        '@typescript-eslint/no-extra-parens': 'off',
        '@next/next/no-html-link-for-pages': 'off',
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    }
};
