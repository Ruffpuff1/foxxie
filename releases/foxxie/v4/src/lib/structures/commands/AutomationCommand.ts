import { PieceContext, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { Message, Permissions, TextChannel } from 'discord.js';
import { FoxxieCommand } from './FoxxieCommand';
import type { GuildMessage } from '../../types/Discord';
import { languageKeys } from 'lib/i18n';
import { aquireSettings, writeSettings } from 'lib/database';
import { send } from '@sapphire/plugin-editable-commands';
import { minutes, prepareAutomationEmbed, resolveToNull, seconds } from 'lib/util';
import { FoxxieEmbed } from 'lib/discord';

export abstract class AutomationCommand extends FoxxieCommand {

    public subCmdEntries: string[];

    public noSetChannelKey?: string;
    public setChannelKey?: string;
    public updateChannelKey?: string;
    public resetChannelKey?: string;

    public noSetMessageKey?: string;
    public setMessageKey?: string;
    public updateMessageKey?: string;
    public resetMessageKey?: string;

    public channelSettingKey?: string;
    public embedSettingsKey?: string;
    public messageSettingsKey?: string;
    public timeoutSettingKey?: string;

    public constructor(context: PieceContext, options: AutomationCommand.Options) {
        super(context, {
            requiredUserPermissions: [Permissions.FLAGS.ADMINISTRATOR],
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            ...options
        });

        this.subCmdEntries = this.registerSubCmds([...options.subCommands]);
    }

    public none(): void {
        this.error(languageKeys.commands.settings.automationNoInput, { possibles: this.subCmdEntries });
    }

    public async channel(msg: GuildMessage, args: AutomationCommand.Args): Promise<Message> {
        const channel = await args.pick('guildTextChannel').catch(() => args.pick('string').catch(() => null));
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        if (typeof channel === 'string' && resetOptions.includes(channel.toLowerCase())) {
            await writeSettings(msg.guild, settings => settings[this.channelSettingKey] = null);
            return send(msg, args.t(this.resetChannelKey));
        } else if (channel instanceof TextChannel) {
            await writeSettings(msg.guild, settings => settings[this.channelSettingKey] = channel.id);
            return send(msg, args.t(this.updateChannelKey, { channel: channel.toString() }));
        }

        return aquireSettings(msg.guild, async settings => {
            const channelId = settings[this.channelSettingKey];
            if (!channelId) return send(msg, args.t(this.noSetChannelKey));

            const channel = await resolveToNull(msg.guild.channels.fetch(channelId));

            if (!channel) {
                // eslint-disable-next-line require-atomic-updates
                settings[this.channelSettingKey] = null;
                return send(msg, args.t(this.noSetChannelKey));
            }
            return send(msg, args.t(this.setChannelKey, { channel: channel.toString() }));
        });
    }

    public async message(msg: GuildMessage, args: AutomationCommand.Args): Promise<Message> {
        const message = await args.rest('string').catch(() => null);
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        if (!message) {
            const now = await aquireSettings(msg.guild, this.messageSettingsKey);
            if (!now) this.error(this.noSetMessageKey);
            return send(msg, args.t(this.setMessageKey, { message: now }));
        }

        if (resetOptions.includes(message.toLowerCase())) {
            await writeSettings(msg.guild, settings => settings[this.messageSettingsKey] = null);
            return send(msg, args.t(this.resetMessageKey));
        }

        const timeout = this.getTimeout(args);
        if (timeout) {
            await writeSettings(msg.guild, settings => settings[this.timeoutSettingKey] = timeout);
        } else {
            await writeSettings(msg.guild, settings => settings[this.timeoutSettingKey] = null);
        }

        await writeSettings(msg.guild, settings => settings[this.messageSettingsKey] = message);
        return send(msg, args.t(this.updateMessageKey, { message }));
    }

    // eslint-disable-next-line consistent-return
    public async embed(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const raw = await args.rest('string').catch(() => null);
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        if (!raw) {
            const now = await aquireSettings(msg.guild, this.embedSettingsKey);
            if (!now) this.error('commands/settings:automationEmbedNoSet');

            const embed = new FoxxieEmbed(msg, now);
            if (now.color) embed.setColor(now.color);

            return send(msg, { content: args.t('commands/settings:automationEmbedSet'), embeds: [prepareAutomationEmbed(embed, msg.member, args.t)] });
        }

        if (resetOptions.includes(raw.toLowerCase())) {
            await writeSettings(msg.guild, settings => settings[this.embedSettingsKey] = null);
            return send(msg, args.t('commands/settings:automationEmbedReset'));
        }
        try {
            const json = JSON.parse(raw.replace(/^{\s+"embed":\s+/i, '').replace(/}$/i, '').trim());

            const embed = new FoxxieEmbed(msg, json);
            if (json.color) embed.setColor(json.color);

            await writeSettings(msg.guild, settings => settings[this.embedSettingsKey] = embed.toJSON());

            return send(msg, { content: args.t('commands/settings:automationEmbedUpdate'), embeds: [prepareAutomationEmbed(embed, msg.member, args.t)] });
        } catch {
            this.error(languageKeys.arguments.json);
        }
    }

    private getTimeout(args: FoxxieCommand.Args): number | null {
        let number: string | null | number = args.getOption('timeout');
        if (!number) return null;

        number = parseInt(number);
        if (number < seconds(1)) return null;
        if (number > minutes(15)) return minutes(15);
        return number;
    }

    private registerSubCmds(cmds: AutomationCommand.Options['subCommands']): string[] {
        return cmds
            .map(entry => {
                if (typeof entry === 'object') {
                    if (entry.input === 'none') return null;
                    return entry.input as string;
                }
                return entry;
            })
            .filter(a => !!a);
    }

}

export namespace AutomationCommand {

    export interface Options extends FoxxieCommand.Options {
        embed?: boolean;
    }

    export type Args = FoxxieCommand.Args
    export type Context = FoxxieCommand.Context
}