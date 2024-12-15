import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { envIsDefined } from '@skyra/env-utilities';
import { resetSpotifyToken } from '#lib/api/Spotify/util';
import { EnvKeys, FoxxieEvents } from '#lib/types';
import { createBanner } from '#utils/startBanner';
import { blue, gray, green, red, yellow } from 'colorette';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<FoxxieEvents.Ready> {
	private readonly style = this.isDev ? yellow : blue;

	public async run() {
		const [spotify] = await Promise.all([this.#initSpotify()]);

		this.printBanner(spotify);
		this.printStoreDebugInformation();
	}

	async #initSpotify() {
		if (!envIsDefined(EnvKeys.SpotifyClientId) || !envIsDefined(EnvKeys.SpotifyClientSecret)) return false;
		const success = await resetSpotifyToken();
		return success;
	}

	private printBanner(spotify: boolean) {
		const success = green('+');
		const failed = red('-');
		const pad = ' '.repeat(5);

		console.log(
			String(
				createBanner({
					extra: [
						String.raw`${`v${process.env.VERSION_NUM}${this.isDev ? '-dev' : ''}${process.env.VERSION_SIG ? ` ${process.env.VERSION_SIG}` : ''}${process.env.COPYRIGHT_YEAR ? ` © ${process.env.COPYRIGHT_YEAR}` : ''}`.padStart(
							38,
							' '
						)}`,
						String.raw`${pad}[${success}] Gateway`,
						String.raw`${pad}[${success}] Moderation`,
						String.raw`${pad}[${this.container.redis ? success : failed}] Redis`,
						String.raw`${pad}[${spotify ? success : failed}] Spotify`,
						String.raw`${pad}[${this.store.has('rawMessageReactionAddStarboard') ? success : failed}] Starboard`,
						String.raw`${this.isDev ? `${pad}</> DEVELOPMENT MODE` : ''}`
					],
					logo: [
						String.raw`      {   }`,
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
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store));
		logger.info(gray(`├─ Loaded ${this.style((2).toString().padEnd(3, ' '))} languages.`));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last = false) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private get isDev() {
		return this.container.client.development;
	}
}
