import { container } from '@sapphire/pieces';
import { AutocompleteInteraction } from 'discord.js';

export class AutoCompleteCommandsService {
    private autoCompleteCommandsData = new Map<AutoCompleteCommand, (interaction: AutocompleteInteraction) => Promise<void>>([
        [AutoCompleteCommand.LastFm, interaction => container.apis.lastFm.handleLastFmAutocomplete(interaction)]
    ]);

    public get<T extends AutoCompleteCommand>(command: T) {
        return this.autoCompleteCommandsData.get(command)!;
    }
}

export enum AutoCompleteCommand {
    LastFm = 'lastfm'
}
