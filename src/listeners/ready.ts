import { Listener, Store } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import type { Events } from '#lib/types';
import i18next from 'i18next';

@ApplyOptions<Listener.Options>({ once: true })
export class UserListener extends Listener<Events.Ready> {
    private readonly style = this.isDev ? yellow : blue;

    public run() {
        this.printBanner();
        this.printStoreDebugInformation();
    }

    private printBanner() {
        const success = green('+');
        // const failed = red('-');
        const pad = ' '.repeat(5);

        const llc = this.isDev ? magentaBright : white;
        const blc = this.isDev ? magenta : blue;

        const line1 = llc(String.raw`            {`);
        const line2 = llc(String.raw`      {   }`);
        const line3 = llc(String.raw`       }_{ __{`);
        const line4 = llc(String.raw`    .-{   }   }-.`);
        const line5 = llc(String.raw`   (   }     {   )`);
        const line6 = llc(String.raw`   |"-.._____..-'|`);
        const line7 = llc(String.raw`   |             ;--.`);
        const line8 = llc(String.raw`   |            (__  \\`);
        const line9 = llc(String.raw`   |             | )  )`);
        const line10 = llc(String.raw`   |             |/  /`);
        const line11 = llc(String.raw`   |             /  /`);
        const line12 = llc(String.raw`   |            (  /`);
        const line13 = llc(String.raw`   \\             y'`);
        const line14 = llc(String.raw`    "-.._____..-'`);

        const name = String.raw`
${line1}      ,____
${line2}       /\  _ "\                    __
${line3}    \ \ \L\_\___   __  _  __  _/\_\    ____
${line4}  \ \  _\/ __"\/\ \/'\/\ \/'\/\ \  /'__"\
${line5}  \ \ \/\ \L\ \/>  </\/>  </\ \ \/\  __/
${line6}   \ \_\ \____//\_/\_\/\_/\_\\ \_\ \___"\
${line7} \/_/\/___/ \//\/_/\//\/_/ \/_/\/____/`;

        const row1 = ``;
        const row2 = ``;
        const row3 = ``;
        const row4 = ``;

        console.log(
            String.raw`
${name}
${line8} ${blc(`${process.env.VERSION_NUM}${this.isDev ? '-dev' : ''} ${process.env.VERSION_SIG}`.padStart(38, ' '))}
${line9} ${pad}[${success}] Gateway
${line10}  ${row1}
${line11}  ${row2}
${line12}  ${row3}
${line13}  ${row4}
${line14}       ${this.isDev ? `${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}`
        );
    }

    private printStoreDebugInformation() {
        const { client, logger } = this.container;
        const stores = [...client.stores.values()];
        const last = stores.pop()!;

        for (const store of stores) logger.info(this.styleStore(store));
        logger.info(gray(`├─ Loaded ${this.style(i18next.languages.length.toString().padEnd(3, ' '))} languages.`));
        logger.info(this.styleStore(last, true));
    }

    private styleStore(store: Store<any>, last = false) {
        return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
    }

    private get isDev() {
        return this.container.client.development;
    }
}
