import { container, Store } from '@sapphire/pieces';
import { envParseBoolean } from '@skyra/env-utilities';
import { EventArgs } from '#lib/types';
import { createBanner } from '#utils/startBanner';
import { blue, gray, green, magentaBright, red, yellow } from 'colorette';
import { Events } from 'discord.js';

import { GatewayEvent } from '../Structures/index.js';

export class ClientHandler {
	@GatewayEvent({ name: Events.ClientReady, once: true })
	public static async Ready() {
		const isDev = container.client.development;
		ClientHandler.Style = isDev ? blue : yellow;

		const success = green('+');
		const failed = red('-');
		const pad = ' '.repeat(5);
		const tenPad = ' '.repeat(10);

		const modules = {
			audio: `[${envParseBoolean('AUDIO_ENABLED', false) ? success : failed}] Audio${tenPad}`,
			moderation: `[${success}] Moderation${pad}`,
			redis: `[${container.redis ? success : failed}] Redis`
		};

		console.log(
			String(
				createBanner({
					extra: [
						String.raw`${pad}${pad}${`v${process.env.VERSION_NUM}${isDev ? '-dev' : ''}${process.env.VERSION_SIG ? ` ${process.env.VERSION_SIG}` : ''}${process.env.COPYRIGHT_YEAR ? ` © ${process.env.COPYRIGHT_YEAR}` : ''}`.padStart(
							38,
							' '
						)}`,
						String.raw`${pad}[${success}] Gateway`,
						String.raw`${pad}${modules.audio}${modules.moderation}`,
						String.raw`${pad}${modules.redis}`,
						String.raw`${isDev ? blue(`${pad}</> DEVELOPMENT MODE`) : ''}`
					],
					logo: [
						String.raw`         `,
						String.raw`       }_{ __{`,
						String.raw`    .-{   }   }-.`,
						String.raw`   (   }     {   )`,
						String.raw`   |"-.._____..-'|`,
						String.raw`   |             ;--.`,
						String.raw`   |            (__  \\`,
						String.raw`   |             | )  )`,
						String.raw`   |             |/  /`,
						String.raw`   |             /  /`,
						String.raw`   |            (  /`,
						String.raw`   \\            y'`,
						String.raw`    "-.._____..-'`
					],
					name: [
						String.raw`,____`,
						String.raw`/\  _ "\                    __`,
						String.raw`\ \ \L\_\___   __  _  __  _/\_\    ____`,
						String.raw` \ \  _\/ __"\/\ \/'\/\ \/'\/\ \  /'__"\ `,
						String.raw`  \ \ \/\ \L\ \/>  </\/>  </\ \ \/\  __/`,
						String.raw`   \ \_\ \____//\_/\_\/\_/\_\\ \_\ \___"\ `,
						String.raw`    \/_/\/___/ \//\/_/\//\/_/ \/_/\/____/`
					]
				})
			)
		);

		const { client, logger } = container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		console.log(client.stores.get('commands'));

		for (const store of stores) logger.info(ClientHandler.StyleStore(store));
		logger.info(gray(`├─ Loaded ${ClientHandler.Style((2).toString().padEnd(3, ' '))} languages.`));
		logger.info(ClientHandler.StyleStore(last, true));
	}

	@GatewayEvent({ name: Events.ShardDisconnect })
	public static ShardDisconnect(...[event, id]: EventArgs<Events.ShardDisconnect>) {
		container.logger.error(`${ClientHandler.ShardHeader(id, red('Disconnected'))}:\n\tCode: ${event.code}\n\tReason: ${event.reason}`);
	}

	@GatewayEvent({ name: Events.ShardError })
	public static ShardError(...[error, id]: EventArgs<Events.ShardError>) {
		container.logger.error(`${ClientHandler.ShardHeader(id, red('Error'))}: ${error.stack ?? error.message}`);
	}

	@GatewayEvent({ name: Events.ShardReady })
	public static ShardReady(...[id, unavailableGuilds]: EventArgs<Events.ShardReady>) {
		container.logger.debug(`${ClientHandler.ShardHeader(id, green('Ready'))}: ${unavailableGuilds?.size ?? 'Unknown or no unavailable'} guilds`);
	}

	@GatewayEvent({ name: Events.ShardReconnecting })
	public static ShardReconnecting(...[id]: EventArgs<Events.ShardReconnecting>) {
		container.logger.debug(`${ClientHandler.ShardHeader(id, yellow('Reconnecting'))}`);
	}

	@GatewayEvent({ name: Events.ShardResume })
	public static ShardResume(...[id, replayedEvents]: EventArgs<Events.ShardResume>) {
		container.logger.debug(`${ClientHandler.ShardHeader(id, yellow('Resumed'))}: ${replayedEvents} events replayed.`);
	}

	private static ShardHeader(shardId: number, title: string): string {
		return `${magentaBright(`Shard ${shardId}:`)} ${title}`;
	}

	private static StyleStore(store: Store<any>, last = false) {
		return gray(`${last ? '└─' : '├─'} Loaded ${ClientHandler.Style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private static Style = blue;
}
