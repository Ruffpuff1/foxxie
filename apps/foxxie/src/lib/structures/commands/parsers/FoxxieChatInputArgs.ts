import { isErr, Result, UserError } from '@sapphire/framework';
import type { ApplicationCommandOption, CommandInteraction, GuildBasedChannel, GuildMember } from 'discord.js';
import type { TFunction } from 'i18next';
import type { FoxxieCommand } from '../FoxxieCommand';

export class FoxxieChatInputArgs<T = Record<string, unknown>> {
    public interaction: CommandInteraction;

    public t: TFunction;

    public command: FoxxieCommand;

    public color: number;

    public options: T;

    public member: GuildMember | null;

    public constructor(interaction: CommandInteraction, t: TFunction, command: FoxxieCommand, color = 0) {
        this.interaction = interaction;
        this.t = t;
        this.command = command;
        this.color = color;

        const options = this.command.container.client.application?.commands.cache.find(
            cmd => cmd.name === (this.command.name === 'user' ? 'info' : this.command.name)
        )?.options;
        if (!options) throw new Error(`failed to find command options for command ${this.command.name}`);

        this.options = this.parseInteractionOptions(options);

        this.member = interaction.guild?.members.cache.get(interaction.user?.id) ?? null;
    }

    public async getDuration(name: string) {
        const result = (await this.command.container.stores
            .get('arguments')
            .get('timespan')!
            .run(this.interaction.options.getString(name)!, {
                command: this.command
            } as any)) as Result<number, UserError>;

        if (isErr(result)) throw result.error;
        return result.value;
    }

    private parseInteractionOptions(options: ApplicationCommandOption[]): T {
        const raw: Record<string, unknown> = {};

        for (const opt of options) {
            switch (opt.type) {
                case 'SUB_COMMAND':
                case 'SUB_COMMAND_GROUP':
                    raw[opt.name] = this.parseInteractionOptions(opt.options ? [...opt.options] : []);
                    break;
                case 'BOOLEAN':
                    raw[opt.name] = this.interaction.options.getBoolean(opt.name);
                    break;
                case 'CHANNEL':
                    raw[opt.name] = this.interaction.options.getChannel(opt.name) as GuildBasedChannel;
                    break;
                case 'INTEGER':
                    raw[opt.name] = this.interaction.options.getInteger(opt.name);
                    break;
                case 'ROLE':
                    raw[opt.name] = this.interaction.options.getRole(opt.name);
                    break;
                case 'USER': {
                    raw[opt.name] = this.interaction.options.getUser(opt.name);
                    // eslint-disable-next-line dot-notation
                    raw.member = this.interaction.options.getMember(opt.name);
                    break;
                }
                case 'MENTIONABLE': {
                    raw[opt.name] = this.interaction.options.getMentionable(opt.name);
                    break;
                }
                case 'NUMBER': {
                    raw[opt.name] = this.interaction.options.getNumber(opt.name);
                    break;
                }
                case 'STRING':
                    raw[opt.name] = this.interaction.options.getString(opt.name);
                    break;
            }
        }

        return raw as T;
    }
}
