import { ConsoleState, EventArgs, FoxxieEvents } from '#lib/Types';
import { BrandingColors } from '#utils/constants';
import { resolveToNull } from '@ruffpuff/utilities';
import { Listener } from '@sapphire/framework';
import { ChannelType, codeBlock, EmbedBuilder } from 'discord.js';

const MESSAGEID = '1308177739546755224';
const CHANNELID = '1307441764856107118';
const GUILDID = '1117671374052397136';
const COLORREG = /\[34m|\[36m|\[39m/gm;

export class UserListener extends Listener {
    private messages: string[] = [];

    public async run(...[state, message]: EventArgs<FoxxieEvents.Console>) {
        if (!this.container.client.isReady()) return;
        this.runLog(state, message);
        await this.runEdit(state, message);
    }

    private async runEdit(state: ConsoleState, message: string) {
        const guild = this.container.client.guilds.cache.get(GUILDID);
        if (!guild) return;

        const channel = await resolveToNull(this.container.client.channels.fetch(CHANNELID));
        if (!channel || channel.type !== ChannelType.GuildText) return;

        const webhooks = await channel.fetchWebhooks();
        const webhook = webhooks.find(w => w.id === '1308174453334872187');
        if (!webhook) return;

        const msg = await resolveToNull(webhook.fetchMessage(MESSAGEID));
        if (!msg) return;

        const content = this.formatContent(state, message);
        const uptime = this.container.client.uptime;

        await webhook.editMessage(msg.id, {
            content: null,
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: 'Foxxie Console' })
                    .setColor(BrandingColors.Primary)
                    .setDescription(codeBlock('ts', content))
                    .setFooter({ text: `Uptime: ${uptime}` })
            ]
        });
    }

    private formatContent(state: ConsoleState, message: string) {
        if (this.messages.join('\n').length >= 3800) {
            this.messages = [`[${this.stringState(state)}] ${message}`.replace(COLORREG, '')];
            return this.messages.join('\n');
        }
        if (this.messages.length >= 10) {
            this.messages.push(`[${this.stringState(state)}] ${message}`.replace(COLORREG, ''));
            this.messages.shift();
            return this.messages.join('\n');
        } else {
            this.messages.push(`[${this.stringState(state)}] ${message}`.replace(COLORREG, ''));
            return this.messages.join('\n');
        }
    }

    private stringState(state: ConsoleState) {
        switch (state) {
            case ConsoleState.Log:
                return 'INFO';
            case ConsoleState.Debug:
                return 'DEBUG';
            case ConsoleState.Error:
                return 'ERROR';
            case ConsoleState.Fatal:
                return 'FATAL';
            case ConsoleState.Warn:
                return 'WARN';
        }
    }

    private runLog(state: ConsoleState, message: string) {
        switch (state) {
            case ConsoleState.Log:
                this.container.logger.info(message);
                break;
            case ConsoleState.Debug:
                this.container.logger.debug(message);
                break;
            case ConsoleState.Error:
                this.container.logger.error(message);
                break;
            case ConsoleState.Fatal:
                this.container.logger.fatal(message);
                break;
            case ConsoleState.Warn:
                this.container.logger.warn(message);
                break;
        }
    }
}
