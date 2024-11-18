import { ReadonlyGuildData } from '../types';

export class SettingsContext {
    public constructor(settings: ReadonlyGuildData) {
        console.log(settings);
    }
}
