import { languageKeys } from '../lib/i18n';
import { Task, aquireSettings, guildSettings, ResponseType, PartialResponseValue, GuildEntity, writeSettings } from '../lib/database';
import { resolveToNull, getAge, nextBirthday, BirthdayData, isOnServer } from '../lib/util';
import type { Guild, GuildMember, TextChannel } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';
import { ApplyOptions } from '@sapphire/decorators';

const enum PartResult {
	NotSet,
	Invalid,
	Success
}

@ApplyOptions<Task.Options>({
    enabled: isOnServer()
})
export default class FoxxieTask extends Task {

    async run(data: BirthdayTaskData): Promise<PartialResponseValue | null> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (!guild) return null;

        const member = await resolveToNull(guild.members.fetch(data.userId));
        if (!member) return null;

        const [channelId, roleId, message, t] = await aquireSettings(guild, settings => {
            return [
                settings[guildSettings.birthday.channel],
                settings[guildSettings.birthday.role],
                settings[guildSettings.birthday.message],
                settings.getLanguage()
            ];
        });

        const results = await Promise.all([
            this.handleMessage(channelId, message, guild, member, data, t),
            this.handleRole(member, roleId)
        ]);

        const success = results.includes(PartResult.Success);
        if (!success) return null;

        const next = nextBirthday(data.month, data.day, { nextYearIfToday: true, timeZoneOffset: 7 });
        return { type: ResponseType.Update, value: next };
    }

    async handleRole(member: GuildMember, roleId: string): Promise<PartResult> {
        if (!roleId) return PartResult.NotSet;

        const role = member.guild.roles.cache.get(roleId);
        if (!role) return PartResult.Invalid;

        if ((member.guild.me?.roles.highest.position as number) > role.position) {
            await this.addBirthdayRole(member, role.id);
        }

        return PartResult.Success;
    }

    async addBirthdayRole(member: GuildMember, roleId: string): Promise<void> {
        await member.roles.add(roleId);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.container.schedule.add('removeBirthdayRole', tomorrow, {
            data: {
                roleId,
                guildId: member.guild.id,
                userId: member.id
            }
        });
    }

    // eslint-disable-next-line max-params
    async handleMessage(channelId: string, message: string, guild: Guild, member: GuildMember, data: BirthdayTaskData, t: TFunction): Promise<PartResult> {
        const channel = channelId ? await resolveToNull(guild.channels.fetch(channelId)) : null;
        if (!channel) {
            await writeSettings(guild, (settings: GuildEntity) => settings[guildSettings.channels.disboard] = null);
            return PartResult.NotSet;
        }

        const content = this.parseMessage(message, member, data, t);

        const sent = await resolveToNull((channel as TextChannel).send({
            content,
            allowedMentions: { parse: ['roles', 'users'] }
        }));

        if (sent) return PartResult.Success;
        return PartResult.Invalid;
    }

    parseMessage(message: string, member: GuildMember, data: BirthdayTaskData, t: TFunction): string {
        const age = getAge(data);
        const messageKey = languageKeys.tasks[`birthdayMessage${age ? 'Age' : ''}`];

        if (!message) message = t(messageKey);

        return message
            .replace(/{member}/gi, member.toString())
            .replace(/{(years|age|old)}/gi, age ? `${age}` : t(languageKeys.tasks.birthdayYearOlder))
            .replace(/{(nick|nickname)}/gi, member.displayName)
            .replace(/{(user|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{guild|server}/gi, member.guild.name);
    }

}

interface BirthdayTaskData extends BirthdayData {
    guildId: string;
    userId: string;
}