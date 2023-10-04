import { FoxxieCommand } from '#lib/Structures';
import { GuildMessage } from '#lib/Types';
import { container } from '@sapphire/framework';
import { SubcommandMappingArray } from '@sapphire/plugin-subcommands';

export class SubCommandsService {
    private subCommandData = new Map<SubCommandCommand, SubcommandMappingArray>([
        [SubCommandCommand.AnimalCrossing, [{ name: 'villager', default: true, messageRun: 'messageRunVillager' }]],
        [
            SubCommandCommand.Info,
            [
                ...['server', 'guild'].map(name => ({
                    name,
                    messageRun: (message: GuildMessage, args: FoxxieCommand.Args) => this.textCommands.info.guild(message, args)
                })),
                ...['user', 'userinfo', 'member'].map(name => ({
                    name,
                    default: true,
                    messageRun: (message: GuildMessage, args: FoxxieCommand.Args) => this.textCommands.info.user(message, args)
                }))
            ]
        ],
        [
            SubCommandCommand.LastFm,
            [
                ...['a', 'artist', 'artistinfo'].map(name => ({
                    name,
                    messageRun: (message: GuildMessage, args: FoxxieCommand.Args) =>
                        this.textCommands.lastFm.artist(message, args)
                    // chatInputRun: (interaction: FoxxieCommand.ChatInputCommandInteraction) =>
                    //     this.chatInputCommands.artist(interaction)
                })),
                // ...['listening', 'nowplaying', 'np'].map(name => ({
                //     name,
                //     messageRun: (message: GuildMessage, args: FoxxieCommand.Args) =>
                //         this.textCommands.lastFm.listening(message, args),
                //     chatInputRun: (interaction: FoxxieCommand.ChatInputCommandInteraction) =>
                //         this.chatInputCommands.listening(interaction),
                //     default: true
                // })),
                ...['globalWhoKnows', 'gwk', 'globalwk', 'gw'].map(name => ({
                    name,
                    messageRun: (message: GuildMessage, args: FoxxieCommand.Args) =>
                        this.textCommands.lastFm.globalWhoKnows(message, args)
                })),
                ...['update', 'u'].map(name => ({
                    name,
                    messageRun: (message: GuildMessage, args: FoxxieCommand.Args) =>
                        this.textCommands.lastFm.update(message, args)
                }))
            ]
        ],
        [
            SubCommandCommand.Permission,
            [
                { name: 'show', default: true, messageRun: 'messageRunShow' },
                { name: 'allow', messageRun: 'messageRunAllow' }
            ]
        ]
    ]);

    public get<T extends SubCommandCommand>(name: T) {
        return this.subCommandData.get(name)!;
    }

    // private get chatInputCommands() {
    //     return container.apis.lastFm.chatInputCommands;
    // }

    private get textCommands() {
        return container.utilities.textCommands;
    }
}

export enum SubCommandCommand {
    AnimalCrossing = 'animalcrossing',
    Info = 'info',
    LastFm = 'lastfm',
    Permission = 'permission'
}
