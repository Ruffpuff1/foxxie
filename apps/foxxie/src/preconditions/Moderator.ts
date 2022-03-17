import type { Result, UserError } from '@sapphire/framework';
import type { CommandInteraction, GuildMember } from 'discord.js';
import { PermissionLevelPrecondition } from '#lib/structures';
import type { GuildMessage } from '#lib/types';
import { isModerator } from '#utils/Discord';
import { LanguageKeys } from '#lib/i18n';

export class UserPrecondition extends PermissionLevelPrecondition {
    public async handle(message: GuildMessage): Promise<Result<unknown, UserError>> {
        return isModerator(message.member) ? this.ok() : this.error({ identifier: LanguageKeys.Preconditions.Moderator });
    }

    public async chatInputHandle(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
        return isModerator(interaction.member as GuildMember) ? this.ok() : this.error({ identifier: LanguageKeys.Preconditions.Moderator });
    }
}
