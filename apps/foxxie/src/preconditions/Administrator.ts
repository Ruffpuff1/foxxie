import type { Result, UserError } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import { PermissionLevelPrecondition } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { isAdmin } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';

export class UserPrecondition extends PermissionLevelPrecondition {
    protected async handle(message: GuildMessage): Promise<Result<unknown, UserError>> {
        return isAdmin(message.member)
            ? this.ok()
            : this.error({
                  identifier: LanguageKeys.Preconditions.Administrator
              });
    }

    protected async chatInputHandle(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
        return isAdmin(interaction.guild!.members.cache.get(interaction.user.id)!)
            ? this.ok()
            : this.error({
                  identifier: LanguageKeys.Preconditions.Administrator
              });
    }
}
