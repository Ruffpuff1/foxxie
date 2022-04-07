import { blue, gray, green, magenta, magentaBright, red, white, yellow, bold } from 'colorette';
import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { floatPromise, isOnServer, setInviteCache } from '../lib/util';
import { CLIENT_OWNERS } from '../config';
import type { FoxxieCommand } from '../lib/structures';
import { SlashCommandBuilder } from '@discordjs/builders';
import type { ApplicationCommandDataResolvable } from 'discord.js';

module.exports = class extends Listener {

    constructor(context: ListenerOptions) {
        super(context as PieceContext, {
            once: true,
            event: 'ready'
        });
    }

    async run() {
        this.log();
        await Promise.all([this.registerCommands(), this.fetchOwners(), this.setInviteCaches()]);
    }

    async setInviteCaches() {
        await Promise.all(this.container.client.guilds.cache.map(async guild => setInviteCache(guild)));
    }

    async registerCommands() {
        const cmdData: unknown[] = [];
        this.container.stores.get('commands').forEach(command => {
            if (!(command as FoxxieCommand).slash) return;
            const data = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(this.container.i18n.format('en-US', command.description));
            cmdData.push(data.toJSON());
        });
        await Promise.all(this.container.client.guilds.cache.map(async guild => floatPromise(guild.commands.set(cmdData as ApplicationCommandDataResolvable[]))));
    }

    async fetchOwners() {
        for (const id of CLIENT_OWNERS) await floatPromise(this.container.client.users.fetch(id));
    }

    log() {
        const { client } = this.container;
        const { shardCount } = client.options;
        const success = green('+');
        const failed = red('-');
        const pad = ' '.repeat(6);
        const development = !isOnServer();
        const llc = development ? magentaBright : white;
        const blc = development ? magenta : blue;

        this.container.logger.info(`[${bold(blue(client.user!.username.toUpperCase()))}] ${green(`Ready! Logged into [${yellow(shardCount ?? '1')}] shard${shardCount === 1 ? '' : 's'}`)}`);

        const line1 = String.raw`            {`;
        const line2 = String.raw`      {   }`;
        const line3 = String.raw`       }_{ __{`;
        const line4 = String.raw`    .-{   }   }-.`;
        const line5 = String.raw`   (   }     {   )`;
        const line6 = String.raw`   |"-.._____..-'|`;
        const line7 = String.raw`   |             ;--.`;
        const line8 = String.raw`   |            (__  \\`;
        const line9 = String.raw`   |             | )  )`;
        const line10 = String.raw`   |             |/  /`;
        const line11 = String.raw`   |             /  /`;
        const line12 = String.raw`   |            (  /`;
        const line13 = String.raw`   \\             y'`;
        const line14 = String.raw`    "-.._____..-'`;

        // eslint-disable-next-line no-console
        console.log(
            String.raw`
${line1}      ,____
${line2}       /\  _ "\                    __
${line3}    \ \ \L\_\___   __  _  __  _/\_\    ____
${line4}  \ \  _\/ __"\/\ \/'\/\ \/'\/\ \  /'__"\
${line5}  \ \ \/\ \L\ \/>  </\/>  </\ \ \/\  __/
${line6}   \ \_\ \____//\_/\_\/\_/\_\\ \_\ \___"\
${line7} \/_/\/___/ \//\/_/\//\/_/ \/_/\/____/
${line8} ${blc(`${process.env.VERSION_NUM}${development ? '-dev' : ''} ${process.env.VERSION_SIG}`.padStart(38, ' '))}
${line9} ${pad}[${success}] ${client.user!.username}
${line10}  ${pad}[${client.audio ? success : failed}] Audio
${line11}   ${pad}[${client.sentry ? success : failed}] Sentry
${line12}
${line13}
${line14}       ${development ? `${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}`
        );

        const style = development ? yellow : blue;

        client.stores.forEach(store => this.container.logger.info(gray(` ├─ Loaded ${style(store.size.toString().padEnd(3, ' '))} ${store.name}.`)));
        this.container.logger.info(gray(` ├─ Loaded ${style(this.container.i18n.languages.size.toString().padEnd(3, ' '))} languages.`));
    }

};