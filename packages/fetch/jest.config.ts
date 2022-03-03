/**
 * @license MIT
 * @copyright 2020 The Sapphire Community and its contributors
 */
import type { Config } from '@jest/types';

// eslint-disable-next-line @typescript-eslint/require-await
export default async (): Promise<Config.InitialOptions> => ({
    displayName: 'unit test',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRunner: 'jest-circus/runner',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json'
        }
    }
});
