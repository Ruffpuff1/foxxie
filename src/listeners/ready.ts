import { FoxxieEvents } from '#lib/Types';
import { createBanner } from '#utils/startBanner';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, yellow } from 'colorette';
import gradient from 'gradient-string';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<FoxxieEvents.Ready> {
    private readonly style = this.isDev ? yellow : blue;

    public run() {
        this.printBanner();
        this.printStoreDebugInformation();
    }

    private printBanner() {
        const success = '+';
        const failed = '-';
        const pad = ' '.repeat(5);

        console.log(
            gradient.teen.multiline(
                createBanner({
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
                    ],
                    extra: [
                        String.raw`${`v${process.env.VERSION_NUM}${this.isDev ? '-dev' : ''}${process.env.VERSION_SIG ? ` ${process.env.VERSION_SIG}` : ''}${process.env.COPYRIGHT_YEAR ? ` © ${process.env.COPYRIGHT_YEAR}` : ''}`.padStart(
                            38,
                            ' '
                        )}`,
                        String.raw`${pad}[${success}] Gateway`,
                        String.raw`${pad}[${success}] Moderation`,
                        String.raw`${pad}[${this.container.redis ? success : failed}] Redis`,
                        String.raw`${pad}[${this.store.has('rawMessageReactionAddStarboard') ? success : failed}] Starboard`,
                        String.raw`${this.isDev ? `${pad}</> DEVELOPMENT MODE` : ''}`
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
