import { SocialCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { days, seconds } from '@ruffpuff/utilities';
import { send } from '@sapphire/plugin-editable-commands';
import { Schedules } from '#utils/constants';

const flags = ['remind', 'remindme', 'rm'];

@ApplyOptions<SocialCommand.Options>({
    aliases: ['rep', 'cookie'],
    description: LanguageKeys.Commands.Social.ReputationDescription,
    detailedDescription: LanguageKeys.Commands.Social.ReputationDetailedDescription,
    flags,
    cooldownDelay: seconds(5),
    cooldownLimit: 3
})
export class UserCommand extends SocialCommand {
    public async messageRun(msg: Message, args: SocialCommand.Args): Promise<Message> {
        const user = await args.pick('username');
        if (user.id === msg.author.id) this.error(LanguageKeys.Commands.Social.ReputationSelf);

        const { author, target } = await this.fetchSettings(msg.author.id, user.id);
        const date = new Date();
        const now = date.getTime();

        const timeReputation = author.cooldown.reputation.time?.getTime();
        const countedReps = author.cooldown.reputation.given;
        const previously = author.cooldown.reputation.users;

        // if last reputation is less than a day away.
        if (
            timeReputation &&
            timeReputation + days(1) > now &&
            // and a user has already given three reps.
            countedReps >= 3
        ) {
            const content = args.t(LanguageKeys.Commands.Social.ReputationTime, { remaining: timeReputation + days(1) - now });
            return send(msg, content);
        }

        const reset = previously.length >= 3 || timeReputation && timeReputation + days(1) < Date.now();

        if (reset) author.cooldown.reputation.users = [];
        if (author.cooldown.reputation.users.includes(user.id)) this.error(LanguageKeys.Commands.Social.ReputationAlreadyExists, { user: user.tag });

        // add the rep
        ++target.reputation;
        // make author's last rep now
        author.cooldown.reputation.time = date;

        // if given is over three reset it.
        if (reset) author.cooldown.reputation.given = 0;
        // up the given rep.
        ++author.cooldown.reputation.given;
        author.cooldown.reputation.users.push(user.id);

        // save the entities into the database.
        await Promise.all([target.save(), author.save()]);

        if (args.getFlags(...flags)) {
            await this.container.tasks.create(
                Schedules.Reminder,
                {
                    channelId: null,
                    userId: msg.author.id,
                    timeago: new Date(),
                    text: args.t(LanguageKeys.Commands.Social.ReputationRemind),
                    json: null,
                    repeat: null
                },
                days(1)
            );
        }

        return send(msg, args.t(LanguageKeys.Commands.Social.ReputationGive, { author: msg.author.tag, target: user.tag }));
    }

    private async fetchSettings(authorId: string, userId: string) {
        const { users } = this.container.db;

        return {
            author: await users.ensureProfileAndCooldown(authorId),
            target: await users.ensureProfile(userId)
        };
    }
}
