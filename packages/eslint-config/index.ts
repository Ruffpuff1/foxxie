const config = {
    root: true,
    extends: ['@ruffpuff'],
    parserOptions: {
        project: '../tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020
    },
    rules: {
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/return-type': 'off',
        complexity: 'off',
        'consistent-return': 'off',
        'require-await': 'off',
        'no-conditional-assignment': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-redeclare': 'error',
        'no-string-throw': 'off',
        'no-use-before-define': 'off',
        'prefer-const': [
            'error',
            {
                destructuring: 'all'
            }
        ],
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                    array: false,
                    object: true
                },
                AssignmentExpression: {
                    array: false,
                    object: false
                }
            }
        ],
        yoda: 'error'
    }
};

module.exports = config;
