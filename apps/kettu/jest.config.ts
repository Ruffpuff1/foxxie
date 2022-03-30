import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
    displayName: 'unit test',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    moduleNameMapper: {
        '^#types/(.*)$': '<rootDir>/src/lib/types/$1',
        '^#utils/(.*)$': '<rootDir>/src/lib/util/$1',
        '^#lib/(.*)$': '<rootDir>/src/lib/$1',
        '^#root/(.*)$': '<rootDir>/src/$1',
        '^#mocks/(.*)$': '<rootDir>/tests/mocks/$1'
    },
    collectCoverageFrom: ['<rootDir>/src/lib/**/*.ts'],
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json'
        }
    }
});
