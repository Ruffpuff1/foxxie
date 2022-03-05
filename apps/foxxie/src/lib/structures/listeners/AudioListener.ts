import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from '#lib/types';
import type { GuildBasedChannelTypes } from '@sapphire/discord.js-utilities';
import { ClientEvents, Message, TextChannel } from 'discord.js';
import { envParseBoolean } from '#lib/env';

export abstract class AudioListener<E extends keyof ClientEvents | symbol = ''> extends Listener<E> {
    public constructor(context: PieceContext, options: AudioListener.Options = {}) {
        super(context, {
            ...options,
            enabled: envParseBoolean('AUDIO_ENABLED')
        });
    }

    public async send(message: GuildMessage | GuildBasedChannelTypes, content: string) {
        return message instanceof Message ? send(message, content) : (message as TextChannel).send(content);
    }
}

export namespace AudioListener {
    export type Options = ListenerOptions;
}
