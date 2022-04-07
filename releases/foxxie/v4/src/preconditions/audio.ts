import { languageKeys } from '../lib/i18n';
import { Precondition, Result, UserError } from '@sapphire/framework';
import type { Message } from 'discord.js';

export default class extends Precondition {

    async run(message: Message): Promise<Result<unknown, UserError>> {
        if (!message.member) return this.error({ identifier: languageKeys.preconditions.audioNoMember });
        return message.member.voice.channelId ? this.ok() : this.error({ identifier: languageKeys.preconditions.audioNoVoiceChannel, context: { member: message.member } });
    }

}