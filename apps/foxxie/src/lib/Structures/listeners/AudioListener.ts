import { Listener, ListenerOptions } from '@sapphire/framework';
import { envParseBoolean } from '@skyra/env-utilities';
import { GuildMessage } from '#lib/types';
import { sendMessage } from '#utils/functions';
import { ClientEvents, GuildTextBasedChannel, Message, TextChannel } from 'discord.js';

export abstract class AudioListener<E extends keyof ClientEvents | symbol = ''> extends Listener<E> {
	public constructor(context: Listener.LoaderContext, options: AudioListener.Options = {}) {
		super(context, {
			...options,
			enabled: envParseBoolean('AUDIO_ENABLED')
		});
	}

	public async send(message: GuildMessage | GuildTextBasedChannel, content: string) {
		return message instanceof Message ? sendMessage(message, content) : (message as TextChannel).send(content);
	}
}

export namespace AudioListener {
	export type Options = ListenerOptions;
}
