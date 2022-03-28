import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    moduleNameMapper: {
        '^#utils/(.*)$': '<rootDir>/src/lib/util/$1',
        '^#lib/(.*)$': '<rootDir>/src/lib/$1',
        '^#types/(.*)$': '<rootDir>/src/lib/types/$1',
        '^#root/(.*)$': '<rootDir>/src/$1',
        '^#mocks/(.*)$': '<rootDir>/tests/mocks/$1'
    },
    collectCoverageFrom: ['<rootDir>/src/lib/**/*.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json'
        }
    }
});
