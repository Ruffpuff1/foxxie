import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
    displayName: 'unit test',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    projects: ['<rootDir>/**/**/jest.config.ts'],
    passWithNoTests: true,
    verbose: false,
    preset: 'ts-jest',
    moduleNameMapper: {
        '^#types/(.*)$': '<rootDir>/src/lib/types/$1',
        '^#utils/(.*)$': '<rootDir>/src/lib/util/$1',
        '^#lib/(.*)$': '<rootDir>/src/lib/$1',
        '^#root/(.*)$': '<rootDir>/src/$1',
        '^#mocks/(.*)$': '<rootDir>/tests/mocks/$1'
    },
    // testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    // testMatch: ['<rootDir>/**/*/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json'
        }
        // },
        // moduleDirectories: [
        //     'node_modules'
        // ]
    }
});
