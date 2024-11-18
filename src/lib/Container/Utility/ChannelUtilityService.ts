import { sendMessages } from '#utils/Discord/permissions';
import { container } from '@sapphire/framework';
import { Channel } from 'discord.js';

export class ChannelUtilityService {
    public channel: Channel;

    public constructor(channel: Channel) {
        this.channel = channel;
    }

    public get isSendable(): boolean {
        if (!this.channel || !this.channel.isTextBased()) return false;
        if (this.channel.isDMBased()) return true;

        const { maybeMe } = container.utilities.guild(this.channel.guild);

        return maybeMe ? this.channel.permissionsFor(maybeMe).has(sendMessages) : false;
    }
}
