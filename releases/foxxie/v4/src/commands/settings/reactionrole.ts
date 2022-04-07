import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Guild, Message, MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { languageKeys } from '../../lib/i18n';
import { BrandingColors, LongLivingReactionCollector, messageLink, resolveToNull, sendLoading } from '../../lib/util';
import { FoxxieCommand } from '../../lib/structures';
import type { GuildMessage } from '../../lib/types/Discord';
import { aquireSettings, guildSettings, ReactionRole, writeSettings } from '../../lib/database';
import { chunk } from '@sapphire/utilities';
import { PaginatedMessage } from '../../lib/discord';
import { channelMention, hideLinkEmbed, hyperlink, roleMention, formatEmoji } from '@discordjs/builders';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['rero', 'rr'],
    requiredUserPermissions: Permissions.FLAGS.ADMINISTRATOR,
    description: languageKeys.commands.settings.reactionroleDescription,
    detailedDescription: languageKeys.commands.settings.reactionroleExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.MANAGE_ROLES],
    subCommands: ['add', 'remove', { input: 'list', default: true }]
})
export class UserCommand extends FoxxieCommand {

    async add(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const role = await args.pick('role');

        await send(msg, args.t(languageKeys.commands.settings.reactionroleAddQuery));
        const reaction = await LongLivingReactionCollector.collectOne({
            filter: reaction => reaction.userId === msg.author.id && reaction.guild.id === msg.guild.id
        });

        if (!reaction) this.error(languageKeys.commands.settings.reactionroleAddNoReaction);
        await resolveToNull(msg.guild.channels.fetch());
        const fetchedMessage = await resolveToNull((msg.guild.channels.cache.get(reaction.channel.id) as TextChannel).messages.fetch(reaction.messageId));

        const rero: ReactionRole = {
            messageId: fetchedMessage!.id,
            channelId: fetchedMessage!.channel.id,
            roleId: role.id,
            emoji: reaction.emoji.id ? reaction.emoji.id : encodeURIComponent(reaction.emoji.name!)
        };

        await writeSettings(msg.guild, async settings => {
            const reros = settings[guildSettings.roles.reaction];
            const { emoji } = reaction;

            const matchedRole = reros.find(role => role.messageId === rero.messageId && role.emoji === rero.emoji);
            if (matchedRole) this.error(languageKeys.commands.settings.reactionroleAddExists);

            try {
                if (fetchedMessage) {
                    await fetchedMessage?.react(`${emoji.name}${emoji.id ? `:${emoji.id}` : ''}`);
                    fetchedMessage.reactions.resolve(emoji.id ?? emoji.name!)?.users.remove(msg.author);
                }

                settings[guildSettings.roles.reaction].push(rero);
                await send(msg, args.t(languageKeys.commands.settings.reactionroleAddSuccess, { role: role.toString() }));
            } catch {
                this.error(languageKeys.commands.settings.reactionroleAddInvalidEmoji);
            }
        });
    }

    async remove(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick('role');
        const messageId = await args.pick('snowflake');

        await writeSettings(msg.guild, settings => {
            const reros = settings[guildSettings.roles.reaction];
            const index = reros.findIndex(entry => (entry.messageId ?? entry.channelId) === messageId && entry.roleId === role.id);
            if (index === -1) this.error(languageKeys.commands.settings.reactionroleRemoveNoExist);

            const removedReactionRole = reros[index];
            reros.splice(index, 1);

            return removedReactionRole;
        });

        return send(msg, args.t(languageKeys.commands.settings.reactionroleRemoveSuccess, { role: role.toString() }));
    }

    @RequiresClientPermissions(Permissions.FLAGS.EMBED_LINKS)
    async list(msg: GuildMessage): Promise<Message> {
        const reros = <ReactionRole[]>await aquireSettings(msg.guild, guildSettings.roles.reaction);
        if (!reros.length) this.error(languageKeys.commands.settings.reactionroleListNone);

        const loading = await sendLoading(msg);

        const display = new PaginatedMessage({
            template: new MessageEmbed().setColor(msg.guild.me!.displayColor || BrandingColors.Primary).setAuthor(msg.guild.name, msg.guild.iconURL({ dynamic: true })!)
        });

        for (const page of chunk(reros, 15)) {
            const serialized = page.map(value => this.format(value, msg.guild)).join('\n');
            display.addPageEmbed(embed => embed.setDescription(serialized));
        }

        await display.run(msg, msg.author);
        return loading.delete();
    }

    private format(entry: ReactionRole, guild: Guild): string {
        const emoji = this.formatEmoji(entry.emoji);
        const role = hyperlink(roleMention(entry.roleId), hideLinkEmbed(messageLink(guild.id, entry.channelId, entry.messageId)));
        return `${emoji} - ${role} ${!entry.messageId ? `-> ${channelMention(entry.channelId)}` : ''}`;
    }

    private formatEmoji(emoji: string): string {
        return emoji.includes('%')
            ? decodeURIComponent(emoji)
            : formatEmoji(emoji);
    }

}