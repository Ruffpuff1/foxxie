import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['bot-info'],
    description: LanguageKeys.Commands.General.AboutDescription,
    detailedDescription: LanguageKeys.Commands.General.AboutDetailedDescription,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {
    /**
     * Foxxie's original creation timestamp.
     */
    private createdAt = new Date(2021, 1, 6, 4, 50);

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const body = args.t(LanguageKeys.Commands.General.AboutSummary, {
            version: process.env.CLIENT_VERSION,
            created: this.createdAt,
            userCount: this.container.client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
            privacy: process.env.PRIVACY_POLICY
        });

        const embed = new MessageEmbed()
            .setColor(args.color)
            .setAuthor({
                name: this.container.client.user!.username,
                iconURL: this.container.client.user!.displayAvatarURL()
            })
            .setDescription(body)
            .setTimestamp();

        return send(msg, { embeds: [embed] });
    }
}
