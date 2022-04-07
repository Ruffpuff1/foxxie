import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import type { GuildMessage } from '../../lib/types/Discord';
import { FoxxieCommand } from '../../lib/structures';
import { isNullOrUndefined, Pronouns, pronouns, sendLoading } from '../../lib/util';
import { send } from '@sapphire/plugin-editable-commands';
import { Args } from '@sapphire/framework';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['pn', 'set-pronouns'],
    generateDashLessAliases: true,
    description: languageKeys.commands.misc.pronounsDescription,
    detailedDescription: languageKeys.commands.misc.pronounsExtendedUsage,
    subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class UserCommand extends FoxxieCommand {

    async set(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const pronounInt = await args.pick(UserCommand.pronouns);
        const loading = await sendLoading(msg);

        const entity = await this.container.db.members.ensure(msg.member.id, msg.guild.id);

        entity.pronouns = typeof pronounInt === 'string' ? pronouns(pronounInt as unknown as Pronouns) as number : pronounInt;
        await entity.save();

        await send(msg, args.t(languageKeys.commands.misc.pronounsSet, { pronouns: this.stringifyPn(pronounInt) }));
        return loading.delete();
    }

    async reset(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);

        const member = await this.container.db.members.ensure(msg.member.id, msg.guild.id);
        member.pronouns = null;

        await member.save();
        await send(msg, args.t(languageKeys.commands.misc.pronounsReset));
        return loading.delete();
    }

    async show(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const member = await args.pick('member').catch(() => msg.member);

        const { pronouns: pnKey } = await this.container.db.members.ensure(member.id, msg.guild.id);
        if (pnKey === null) this.error(languageKeys.commands.misc.pronounsNone, { context: msg.author.id === member.id ? 'self' : '', name: member.displayName });

        return send(msg, args.t(languageKeys.commands.misc.pronounsShow, { context: msg.author.id === member.id ? 'self' : '', pronouns: pronouns(pnKey), name: member.displayName }));
    }

    static pronouns = Args.make<string | number>((parameter, { argument, args }) => {
        const other = args.t(languageKeys.globals.other);
        const none = args.t(languageKeys.globals.none);
        const any = args.t(languageKeys.globals.any);

        if (parameter === none) return Args.ok(Pronouns['use name']);
        if (parameter === other) return Args.ok(Pronouns['other pronouns']);
        if (parameter === any) return Args.ok(Pronouns['any pronouns']);

        const parsed = pronouns(parameter as unknown as Pronouns);
        if (isNullOrUndefined(parsed)) return Args.error({
            argument,
            parameter,
            identifier: languageKeys.arguments.invalidPronouns
        });

        return Args.ok(parsed!);
    });

    private stringifyPn(pronounInt: string | number) {
        if (typeof pronounInt === 'number') return pronouns(pronounInt);
        return pronounInt;
    }

}