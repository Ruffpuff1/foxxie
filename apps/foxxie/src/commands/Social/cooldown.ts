import { SocialCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageEmbed } from 'discord.js';
import { days, toTitleCase } from '@ruffpuff/utilities';
import type { GuildMessage } from '#lib/types';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<SocialCommand.Options>({
    aliases: ['cd', 'cooldowns'],
    description: LanguageKeys.Commands.Social.CooldownDescription,
    detailedDescription: LanguageKeys.Commands.Social.CooldownDetailedDescription
})
export class UserCommand extends SocialCommand {
    public async messageRun(msg: GuildMessage, args: SocialCommand.Args): Promise<Message> {
        const entity = await this.container.db.users.ensureCooldown(msg.author.id);

        const now = Date.now();
        const timeReputation = entity.cooldown.reputation?.time?.getTime();
        const countedReps = entity.cooldown.reputation.given;
        const given = entity.cooldown.reputation.users;
        const { daily } = entity.cooldown;

        const none = toTitleCase(args.t(LanguageKeys.Globals.None));
        const description: string[] = [];

        const dailyValue = daily && daily.getTime() >= now ? args.t(LanguageKeys.Globals.Remaining, { value: daily.getTime() - now, formatParams: { depth: 2 } }) : none;

        description.push(args.t(LanguageKeys.Commands.Social.CooldownDaily, { remaining: dailyValue }));

        const repValue =
            timeReputation && timeReputation + days(1) > now && countedReps >= 3
                ? args.t(LanguageKeys.Globals.Remaining, { value: timeReputation + days(1) - now, formatParams: { depth: 2 } })
                : none;

        description.push(args.t(LanguageKeys.Commands.Social.CooldownRep, { remaining: repValue }));

        const users = given.map(id => this.client.users.cache.get(id)?.tag);
        const countValue = countedReps !== 0 && countedReps <= 3 ? args.t(LanguageKeys.Commands.Social.CooldownRepGiven, { count: countedReps, users }) : none;

        description.push(args.t(LanguageKeys.Commands.Social.CooldownGiven, { value: countValue }));

        const embed = new MessageEmbed()
            .setColor(args.color)
            .setDescription(description.join('\n'))
            .setAuthor({
                name: args.t(LanguageKeys.Commands.Social.CooldownTitle, { name: msg.author.tag }),
                iconURL: msg.member.displayAvatarURL({ dynamic: true })
            });

        return send(msg, { embeds: [embed] });
    }
}
