import { ApplicationCommandRegistry } from '@sapphire/framework';

export class ChatInputCommandsService {
    private idHints = new Map<ChatInputCommand, string[]>([[ChatInputCommand.LastFm, ['1149530889907347466']]]);

    public getCommandOptions(command: ChatInputCommand): ApplicationCommandRegistry.RegisterOptions {
        return {
            idHints: this.getIdHints(command)
        };
    }

    private getIdHints(command: ChatInputCommand): string[] {
        return this.idHints.get(command)!;
    }
}

export enum ChatInputCommand {
    LastFm = 'lastfm'
}
