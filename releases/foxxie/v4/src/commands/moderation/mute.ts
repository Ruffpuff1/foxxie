import { ModerationCommand } from '../../lib/moderation';
import { ApplyOptions } from '@sapphire/decorators';
import { getModeration, getMuteRole, prompt, promptForMessage, sendTemporaryMessage } from '../../lib/util';
import { Permissions, Role, User } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import { aquireSettings, GuildEntity, guildSettings, ModerationEntity, writeSettings } from '../../lib/database';
import { languageKeys } from '../../lib/i18n';
import type { Argument } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<ModerationCommand.Options>({
    aliases: ['m', 'shut'],
    successKey: languageKeys.commands.moderation.muteSuccess,
    description: languageKeys.commands.moderation.muteDescription,
    detailedDescription: languageKeys.commands.moderation.muteExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.MANAGE_ROLES, Permissions.FLAGS.ADD_REACTIONS],
    requiredUserPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    memberOnly: true,
    duration: true
})
export default class FoxxieModerationCommand extends ModerationCommand {

    // eslint-disable-next-line max-params
    async log(msg: GuildMessage, successes: User[], duration: number | null, reason: string, args: ModerationCommand.Args): Promise<ModerationEntity> {
        const muterole = await getMuteRole(msg.guild);
        if (!muterole) await this.ask(msg, args);

        return (await getModeration(msg.guild).actions.mute(
            {
                userId: successes.map(user => user.id),
                channelId: msg.channel.id,
                moderatorId: msg.author.id,
                reason,
                duration
            },
            await this.getDmData(msg)
        ))!;
    }

    private async ask(msg: GuildMessage, args: ModerationCommand.Args): Promise<void> {
        const autoDelete = await <Promise<boolean>>aquireSettings(msg.guild, guildSettings.messages.moderationAutoDelete);

        if (await prompt(msg, args.t(languageKeys.commands.moderation.roleSetupExisting))) {
            const role = await this.getRole(msg, args, args.commandContext);
            if (!role.success) this.error(role.error);

            await writeSettings(msg.guild, (settings: GuildEntity) => settings[guildSettings.roles.muted] = role.value.id);
        } else if (await prompt(msg, args.t(languageKeys.commands.moderation.roleSetupMake))) {
            await getModeration(msg.guild).actions.setUpMuteRole(msg);

            if (autoDelete) await sendTemporaryMessage(msg, args.t(languageKeys.commands.moderation.roleSetupSuccess));
            else send(msg, args.t(languageKeys.commands.moderation.roleSetupSuccess));
        } else {
            this.error(languageKeys.commands.moderation.roleSetupAborted);
        }
    }

    private async getRole(msg: GuildMessage, args: ModerationCommand.Args, context: ModerationCommand.Context) {
        const result = await promptForMessage(msg, args.t(languageKeys.commands.moderation.roleSetupAsk));
        if (result === null) this.error(languageKeys.commands.moderation.roleSetupNone);

        const argument = this.container.stores.get('arguments').get('role') as Argument<Role>;
        return argument.run(result, { args, argument, command: this, commandContext: context, message: msg });
    }

}