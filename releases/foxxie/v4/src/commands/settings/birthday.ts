import { findTasksFromGuild, getAge, sendLoading, days, years, BirthdayScheduleEntity, BrandingColors, findTasksByMember, BirthdayData, getDateFormat, monthOfYearContainsDay, yearIsLeap, nextBirthday, resolveToNull } from '../../lib/util';
import { PaginatedMessage } from '../../lib/discord';
import { FoxxieCommand } from '../../lib/structures';
import { Message, MessageEmbed, Permissions, Role, TextChannel } from 'discord.js';
import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from '@sapphire/decorators';
import { languageKeys } from '../../lib/i18n';
import type { GuildMessage } from '../../lib/types/Discord';
import { chunk } from '@ruffpuff/utilities';
import type { TFunction } from '@sapphire/plugin-i18next';
import { send } from '@sapphire/plugin-editable-commands';
import { Args } from '@sapphire/framework';
import { aquireSettings, GuildEntity, guildSettings, writeSettings } from '../../lib/database';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['bd'],
    description: languageKeys.commands.settings.birthdayDescription,
    detailedDescription: languageKeys.commands.settings.birthdayExtendedUsage,
    subCommands: ['reset', 'list', 'set', 'channel', 'role', 'message', { input: 'view', default: true }]
})
export default class UserCommand extends FoxxieCommand {

    public async set(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const date = await args.pick(UserCommand.dateWithOptionalYear);
        const task = findTasksByMember(msg.member);
        if (task) await this.container.schedule.remove(task.id);

        const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });
        await this.container.schedule.add('birthday', birthday, { data: this.constructData(date, msg) });
        await send(msg, args.t(languageKeys.commands.settings.birthdaySetSuccess, { birthday }));
    }

    public view(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = findTasksByMember(msg.member);
        if (!task) this.error(languageKeys.commands.settings.birthdayNone);
        return send(msg, args.t(languageKeys.commands.settings.birthdayView, { birthday: task.time }));
    }

    public async reset(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const task = findTasksByMember(msg.member);
        if (!task) this.error(languageKeys.commands.settings.birthdayNone);
        await this.container.schedule.remove(task.id);
        return send(msg, args.t(languageKeys.commands.settings.birthdayResetSuccess));
    }

    @RequiresUserPermissions(Permissions.FLAGS.ADMINISTRATOR)
    public async message(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const message = await args.rest('string').catch(() => null);
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        if (typeof message === 'string' && resetOptions.includes(message.toLowerCase())) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.message] = null;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayMessageReset));
        } else if (message) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.message] = message;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayMessageSet, { message }));
        }
        const setMessage = await aquireSettings(msg.guild, settings => {
            const bdMessage = settings[guildSettings.birthday.message];
            if (!bdMessage) this.error(languageKeys.commands.settings.birthdayMessageNone);
            return bdMessage;
        });

        return send(msg, args.t(languageKeys.commands.settings.birthdayMessageNow, { message: setMessage }));
    }

    @RequiresUserPermissions(Permissions.FLAGS.ADMINISTRATOR)
    public async role(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const role = await args.pick('role').catch(() => args.pick('string')).catch(() => null);
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        // reset role if param is "none".
        if (typeof role === 'string' && resetOptions.includes(role.toLowerCase())) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.role] = null;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayRoleReset));
            // if the role is a role, set it
        } else if (role instanceof Role) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.role] = role.id;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayRoleSet, { role: role.toString() }));
        }
        // otherwise attempt to show
        const setRole = await aquireSettings(msg.guild, settings => {
            const roleId = settings[guildSettings.birthday.role];
            if (!roleId) this.error(languageKeys.commands.settings.birthdayRoleNone);
            // check if role is still in guild, if not unset.
            const role = msg.guild.roles.cache.get(roleId);
            if (!role) {
                settings[guildSettings.birthday.role] = null;
                return send(msg, args.t(languageKeys.commands.settings.birthdayRoleNone));
            }
            // otherwise return the role.
            return role;
        });

        return send(msg, args.t(languageKeys.commands.settings.birthdayRoleNow, { role: setRole.toString() }));
    }

    @RequiresUserPermissions(Permissions.FLAGS.ADMINISTRATOR)
    public async channel(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const channel = await args.pick('guildTextChannel').catch(() => args.pick('string')).catch(() => null);
        const resetOptions = args.t(languageKeys.globals.resetOptions);

        // reset channel if param is "none".
        if (typeof channel === 'string' && resetOptions.includes(channel.toLowerCase())) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.channel] = null;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayChannelReset));
        // if the channel is text, set it
        } else if (channel instanceof TextChannel) {
            await writeSettings(msg.guild, (settings: GuildEntity) => {
                settings[guildSettings.birthday.channel] = channel.id;
            });
            return send(msg, args.t(languageKeys.commands.settings.birthdayChannelSet, { channel: channel.toString() }));
        }
        // otherwise show.
        const setChannel = await aquireSettings(msg.guild, (settings: GuildEntity) => {
            const birthdayChannelId = settings[guildSettings.birthday.channel];
            if (!birthdayChannelId) this.error(languageKeys.commands.settings.birthdayChannelNone);
            // check if id is valid channel in guild
            const channel = resolveToNull(msg.guild.channels.fetch(birthdayChannelId));
            // if not remove the id
            if (!channel) {
                settings[guildSettings.birthday.channel] = null;
                return send(msg, args.t(languageKeys.commands.settings.birthdayChannelNone));
            }
            // otherwise show the channel
            return channel;
        });

        return send(msg, args.t(languageKeys.commands.settings.birthdayChannelNow, { channel: setChannel.toString() }));
    }

    @RequiresUserPermissions(Permissions.FLAGS.MANAGE_MESSAGES)
    @RequiresClientPermissions([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.EMBED_LINKS])
    public async list(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        if (msg.guild.memberCount !== msg.guild.members.cache.size) await msg.guild.members.fetch();

        const birthdays = findTasksFromGuild(msg.guild)
            .filter(birthday => {
                const time = birthday.time.getTime();
                const now = new Date().getDate();

                if (time > (now + years(1) + days(1))) return true;
                return true;
            });

        if (!birthdays.length) {
            await loading.delete();
            return this.error(languageKeys.commands.settings.birthdayListNone);
        }

        const template = new MessageEmbed()
            .setColor(msg.guild.me?.displayColor || BrandingColors.Primary)
            .setAuthor(args.t(languageKeys.commands.settings.birthdayListTitle, { guild: msg.guild.name, count: birthdays.length }), msg.guild.iconURL({ dynamic: true }) as string);

        const display = new PaginatedMessage({ template }).setPromptMessage(args.t(languageKeys.system.reactionHandlerPrompt));

        for (const page of chunk(birthdays, 10)) {
            const description = page.map((birthday: BirthdayScheduleEntity) => this.mapBirthday(birthday, msg, args.t)).filter((a: string | null) => !!a).join('\n');
            display.addPageEmbed(embed => embed.setDescription(description));
        }

        await display.run(msg, msg.author);
        return loading.delete();
    }

    private mapBirthday(birthday: BirthdayScheduleEntity, msg: GuildMessage, t: TFunction): string | null {
        const { data } = birthday;
        const formatted = t(languageKeys.globals.dateShort, { date: birthday.time.getTime() });

        const member = msg.guild.members.cache.get(data.userId);
        if (!member) return null;

        const age = getAge({ day: data.day, month: data.month, year: data.year }, { now: birthday.time.getTime() });

        return [
            `**${formatted}**`,
            `${member.displayName}${age ? ` (${age})` : ''}`
        ].join('\n');
    }

    private constructData(date: BirthdayData, msg: GuildMessage): BirthdayScheduleEntity['data'] {
        return {
            guildId: msg.guild.id,
            userId: msg.author.id,
            year: date.year,
            month: date.month,
            day: date.day
        };
    }

    private static readonly dateWithOptionalYear = Args.make<BirthdayData>((parameter, { argument, args }) => {
        const format = args.t(languageKeys.globals.dateFormat);
        const regExp = getDateFormat(format, args.t.lng);
        const result = regExp.exec(parameter);
        if (result === null) {
            return Args.error({
                argument,
                parameter,
                identifier: languageKeys.arguments.invalidBirthday,
                context: { formatWithYear: format }
            });
        }

        const year = result.groups!.year === undefined ? null : Number(result.groups!.year);
        if (year !== null && (year < 1903 || year > new Date().getUTCFullYear())) {
            const msg = year < 1903
                ? args.t(languageKeys.arguments.birthdayYearOld)
                : args.t(languageKeys.arguments.birthdayYearFuture);

            return Args.error({ argument, parameter, identifier: languageKeys.arguments.invalidBirthdayYear, context: { msg, year } });
        }

        const month = Number(result.groups!.month);
        if (month <= 0 || month > 12) {
            return Args.error({ argument, parameter, identifier: languageKeys.arguments.invalidBirthdayMonth, context: { month } });
        }

        const day = Number(result.groups!.day);
        if (day <= 0 || !monthOfYearContainsDay(year === null ? true : yearIsLeap(year), month, day)) {
            const monthKey = args.t(`${languageKeys.arguments.birthdayMonths}.${month - 1}`);
            return Args.error({ argument, parameter, identifier: languageKeys.arguments.invalidBirthdayDay, context: { day, monthKey } });
        }

        return Args.ok({ year, month, day });
    });

}