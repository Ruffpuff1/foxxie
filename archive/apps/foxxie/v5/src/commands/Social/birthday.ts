import { FoxxieCommand } from '#lib/structures';
import { LanguageKeys } from '#lib/i18n';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { Schedules } from '#utils/constants';
import type { GuildMessage } from '#lib/types';
import { fetchTasks, MappedJob, sendLoadingMessage } from '#utils/util';
import { chunk, isDev, resolveToNull } from '@ruffpuff/utilities';
import { MessageEmbed } from 'discord.js';
import { PaginatedMessage } from '#external/PaginatedMessage';
import type { TFunction } from 'i18next';
import { BirthdayData, getAge, getDateFormat, monthOfYearContainsDay, nextBirthday, yearIsLeap } from '#utils/birthday';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['bd', 'bday'],
    description: LanguageKeys.Commands.Social.BirthdayDescription,
    detailedDescription: LanguageKeys.Commands.Social.BirthdayDetailedDescription,
    enabled: !isDev(),
    subCommands: ['list', 'set']
})
export class UserCommand extends FoxxieCommand {
    @RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
    public async list(msg: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
        const loading = await sendLoadingMessage(msg);
        const tasks = await fetchTasks(Schedules.Birthday);

        const template = new MessageEmbed().setAuthor({ name: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true })! }).setColor(args.color);

        const display = new PaginatedMessage({ template });

        for (const page of chunk(tasks, 10)) {
            display.addAsyncPageBuilder(async builder => {
                const description = await Promise.all(page.map(async p => this.mapBirthday(p, args.t)));

                const embed = new MessageEmbed().setDescription(description.join('\n'));

                return builder.setEmbeds([embed]).setContent(null!);
            });
        }

        await display.run(loading, msg.author);
    }

    public async set(msg: GuildMessage, args: FoxxieCommand.Args) {
        const date = await args.pick(UserCommand.Date);
        const tasks = await fetchTasks(Schedules.Birthday);
        const task = tasks.find(task => task.data.userId === msg.author.id && task.data.guildId === msg.guild.id);

        if (task) this.container.tasks.delete(task.id);
        const birthday = nextBirthday(date.month, date.day, { timeZoneOffset: 7 });
        await this.container.tasks.create(Schedules.Birthday, this.constructData(date, msg), birthday.getTime() - Date.now());

        await send(msg, args.t(LanguageKeys.Commands.Social.BirthdaySetSuccess, { birthday }));
    }

    private async mapBirthday(birthday: MappedJob<Schedules.Birthday>, t: TFunction) {
        const user = await resolveToNull(this.client.users.fetch(birthday.data.userId));
        const formatted = t(LanguageKeys.Globals.DateShort, { date: birthday.time.getTime() });

        const age = getAge({ day: birthday.data.day, month: birthday.data.month, year: birthday.data.year }, { now: birthday.time.getTime() });

        return [`**${formatted}**`, `${user?.tag || t(LanguageKeys.Globals.Unknown)}${age ? ` (${age})` : ''}`].join('\n');
    }

    private constructData(date: BirthdayData, msg: GuildMessage) {
        return {
            guildId: msg.guild.id,
            userId: msg.author.id,
            year: date.year,
            month: date.month,
            day: date.day
        };
    }

    private static Date = Args.make<BirthdayData>((parameter, { argument, args }) => {
        const format = args.t(LanguageKeys.Globals.DateFormat);
        const regex = getDateFormat(format, args.t.lng);
        const result = regex.exec(parameter);

        if (result === null) {
            return Args.error({
                argument,
                parameter,
                identifier: LanguageKeys.Arguments.Birthday,
                context: { formatWithYear: format }
            });
        }

        const year = result.groups!.year === undefined ? null : Number(result.groups!.year);
        if (year !== null && (year < 1903 || year > new Date().getUTCFullYear())) {
            const msg = year < 1903 ? args.t(LanguageKeys.Arguments.BirthdayYearPast) : args.t(LanguageKeys.Arguments.BirthdayYearFuture);

            return Args.error({ argument, parameter, identifier: LanguageKeys.Arguments.BirthdayYear, context: { msg, year } });
        }

        const month = Number(result.groups!.month);
        if (month <= 0 || month > 12) {
            return Args.error({ argument, parameter, identifier: LanguageKeys.Arguments.BirthdayMonth, context: { month } });
        }

        const day = Number(result.groups!.day);
        if (day <= 0 || !monthOfYearContainsDay(year === null ? true : yearIsLeap(year), month, day)) {
            const monthKey = args.t(`${LanguageKeys.Arguments.BirthdayMonths}.${month - 1}`);
            return Args.error({ argument, parameter, identifier: LanguageKeys.Arguments.BirthdayDay, context: { day, monthKey } });
        }

        return Args.ok({ year, month, day });
    });
}
