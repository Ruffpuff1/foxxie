import { ApplicationCommandRegistry } from '@sapphire/framework';
import { LastFmChatInputCommands } from './LastFmCommands';

export class ChatInputCommandsService {
    public lastFm = new LastFmChatInputCommands();

    private idHints = new Map<ChatInputCommand, string[]>([[ChatInputCommand.LastFm, ['1149530889907347466']]]);

    public getRegisterOptions(command: ChatInputCommand): ApplicationCommandRegistry.RegisterOptions {
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
