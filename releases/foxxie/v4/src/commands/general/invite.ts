import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures/commands';
import { Permissions, Message } from 'discord.js';
import { FoxxieEmbed } from '../../lib/discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Urls } from '../../lib/util';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['botinvite', 'support'],
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS],
    description: languageKeys.commands.general.inviteDescription,
    detailedDescription: languageKeys.commands.general.inviteExtendedUsage,
    flags: ['np', 'noperms']
})
export default class extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const noperms = args.getFlags('np', 'noperms');

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setDescription([
                args.t(languageKeys.commands.general.inviteLinks, {
                    invite: noperms
                        ? this.noPermsInvite
                        : this.invite,
                    server: Urls.Community
                }),
                noperms ? null : args.t(languageKeys.commands.general.invitePerms)
            ].filter(a => !!a));

        return send(msg, { embeds: [embed] });
    }

    get noPermsInvite(): string {
        return `https://discordapp.com/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=0&scope=bot&scope=applications.commands`;
    }

    get invite(): string {
        const permissions = new Permissions(Permissions.FLAGS.ADMINISTRATOR).bitfield;

        return `https://discordapp.com/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=${permissions}&scope=bot&scope=applications.commands`;
    }

}