import type { Message, NewsChannel, TextChannel, ThreadChannel } from 'discord.js';
import { FoxxieCommand } from 'lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { languageKeys } from 'lib/i18n';
import { setTimeout as sleep } from 'timers/promises';
import type { GuildMessage } from 'lib/types/Discord';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { getModeration } from 'lib/util';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['ul'],
    description: languageKeys.commands.moderation.unlockDescription,
    detailedDescription: languageKeys.commands.moderation.unlockExtendedUsage,
    requiredClientPermissions: [PermissionFlagsBits.ManageChannels],
    requiredUserPermissions: [PermissionFlagsBits.ManageChannels]
})
export class UserCommand extends FoxxieCommand {

    public async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const channel = await args.pick('guildTextChannel').catch(() => msg.channel);
        this.checkLock(msg, channel);
        const reason = args.finished ? null : await args.rest('string');

        await send(msg, args.t(languageKeys.commands.moderation.unlockLoading));
        await getModeration(msg.guild).actions.unlock(
            {
                moderatorId: msg.author.id,
                channelId: channel.id,
                reason
            },
            channel
        );
        await sleep(700);
        return send(msg, args.t(languageKeys.commands.moderation.unlockSuccess, { channel: channel.toString() }));
    }

    private checkLock(msg: GuildMessage, channel: TextChannel | NewsChannel | ThreadChannel): void {
        if (channel.permissionsFor(msg.guild.id).has(PermissionFlagsBits.SendMessages)) this.error(languageKeys.commands.moderation.unlockAlready, {
            channel: channel.toString()
        });
    }

}