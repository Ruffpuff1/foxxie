import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures/commands';
import { Permissions, Message } from 'discord.js';
import { hostname } from 'os';
import { FoxxieEmbed } from '../../lib/discord';
import { dependencies, version } from '../../../package.json';
import { Urls } from '../../lib/util';
import { CLIENT_OWNERS } from '../../config';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { ClientEntity } from '../../lib/database';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['up', 'uptime'],
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    description: languageKeys.commands.general.statsDescription
})
export default class extends FoxxieCommand {

    public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<Message> {
        const githead = ` [${args.t(languageKeys.globals.version)}]`;

        const { deps } = this;
        const [shard, shardTotal]: number[] = [
            (message.guild
                ? message.guild.shardId
                : 0) + 1,
            this.container.client.options.shardCount || 1
        ];

        const entity = await this.container.db.clients.ensure();
        const [commands, messages] = [this.getCommands(entity), this.getMessages(entity)];

        const stats = args.t(languageKeys.commands.general.statsMenu, {
            joinArrays: '\n',
            commands,
            messages,
            uptime: Date.now() - (this.container.client.uptime as number),
            process: hostname(),
            shard,
            shardTotal,
            deps
        });

        const ownerArr = CLIENT_OWNERS
            .filter(id => id !== '749845359689465977')
            .map(id => this.container.client.users.cache.get(id))
            .filter(u => !!u)
            .map(user => user?.tag);

        const embed = new FoxxieEmbed(message)
            .setAuthor(
                `${this.container.client.user?.username} v${version}${githead}`,
                this.container.client.user?.displayAvatarURL({ format: 'png', size: 2048 }),
                Urls.Repo
            )
            .setDescription(stats)
            .setColor(await this.container.db.fetchColor(message))
            .setFooter(`© ${process.env.COPYRIGHT_YEAR} ${args.t(languageKeys.globals.and, { value: ownerArr })}`);

        return send(message, { embeds: [embed] });
    }

    get deps(): string[] {
        const discord = dependencies['discord.js'];
        const sapp = dependencies['@sapphire/framework'];

        return [
            `Node.js ${process.version}`,
            `Discord.js ${discord}`,
            `Sapphire ${sapp}`
        ];
    }

    getCommands(client: ClientEntity): number {
        return client.commandCount;
    }

    /**
     * Returns the total message count of all guilds the client is in.
     * @returns {Promise<number>} total
     */
    getMessages(client: ClientEntity): number {
        return client.messageCount;
    }

}