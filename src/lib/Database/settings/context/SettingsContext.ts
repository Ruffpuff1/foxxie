import { FoxxieGuild } from '#Database/Models';

export class SettingsContext {
    public constructor(settings: FoxxieGuild) {
        console.log(settings);
    }
}
