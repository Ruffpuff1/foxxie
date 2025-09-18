import { randomArray } from '@ruffpuff/utilities';
import { MessageOptions, send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import { cast } from '@sapphire/utilities';
import { CustomFunctionGet, CustomGet, GuildMessage, LanguageKeys } from '#root/Bot/Resources/index';
import { EmbedBuilder, italic } from 'discord.js';

export class MessageService {
	public static async SendLoadingMessage(
		message: GuildMessage,
		key?: CustomFunctionGet<any, string, string[]> | CustomGet<string, string[]>,
		args?: object
	) {
		const t = await fetchT(message.guild!);
		const translated = t(typeof key === 'boolean' ? LanguageKeys.System.MessageLoading : key || LanguageKeys.System.MessageLoading, args as any);
		const content = italic(cast<string>(Array.isArray(translated) ? randomArray(cast<any>(translated)) : translated));

		return MessageService.SendMessage(message, content);
	}

	public static async SendMessage(message: GuildMessage, options: EmbedBuilder | MessageOptions | string | string[], arrayJoiner = '\n') {
		const resolvedOptions =
			typeof options === 'string'
				? { components: [], content: options, embeds: [] }
				: Array.isArray(options)
					? options.join(arrayJoiner)
					: options instanceof EmbedBuilder
						? { components: [], content: null, embeds: [options] }
						: { components: [], content: null!, embeds: [], ...options };

		return send(message, resolvedOptions);
	}
}
