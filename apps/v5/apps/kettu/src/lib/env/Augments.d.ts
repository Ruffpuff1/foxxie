import { KettuEnv } from './types';

declare global {
    namespace NodeJS {
        type ProcessEnv = KettuEnv;
    }
}
