import { EmbedBuilder, MessageCreateOptions } from 'discord.js';

export class MessageOptions {
    public content: string | null = null;

    public embeds: EmbedBuilder[] = [];

    public constructor(data: Partial<MessageOptions> | string | null | EmbedBuilder) {
        if (typeof data === 'string') {
            this.content = data;
        } else if (data) {
            if (data instanceof EmbedBuilder) {
                this.embeds = [data];
            } else {
                if (data.content) {
                    this.content = data.content;
                }

                if (data.embeds && data.embeds.length) {
                    this.embeds = data.embeds;
                }
            }
        }
    }

    public toJSON(): MessageCreateOptions {
        return {
            embeds: this.embeds,
            content: this.content || undefined
        };
    }
}
