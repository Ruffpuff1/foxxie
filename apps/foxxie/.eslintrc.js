module.exports = {
    extends: '@foxxie',
    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    },
    rules: {
<<<<<<< HEAD
        'no-redeclare': 'off',
=======
        '@typescript-eslint/no-extra-parens': 'off',
>>>>>>> 996a644 (feat: migrate moderation handling)
        '@typescript-eslint/member-ordering': [
            'error',
            {
                default: [
                    'public-field',
                    'protected-field',
                    'private-field',
                    'public-method',
                    'protected-method',
                    'private-method',
                    'public-get',
                    'protected-get',
                    'private-get',
                    'public-set',
                    'protected-set',
                    'private-set',
                    'public-static-field',
                    'protected-static-field',
                    'private-static-field'
                ]
            }
        ]
    }
};
