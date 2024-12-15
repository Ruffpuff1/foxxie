import type { FoxxieEnv } from './types';

declare global {
    namespace NodeJS {
        // TODO fix
        type ProcessEnv = FoxxieEnv;
        interface Process {
            env: FoxxieEnv;
        }
    }
}
