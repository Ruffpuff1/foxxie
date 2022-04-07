import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures';
import { isgdShorten, isgdCustom } from '../../lib/util';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['tinylink'],
    description: languageKeys.commands.misc.shorten.description,
    detailedDescription: languageKeys.commands.misc.shorten.extendedUsage
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const link = await args.pick('hyperlink');
        const name = await args.rest('string').catch(() => null);

        if (!name) {
            return isgdShorten(link.href)
                .then(link => this.success(msg, link, args))
                .catch(err => send(msg, err));
        }
        return isgdCustom(link.href, name)
            .then(link => this.success(msg, link, args))
            .catch(() => this.error(languageKeys.commands.misc.shorten.error, { name }));
    }

    success(msg: Message, link: string, args: FoxxieCommand.Args): Promise<Message> {
        return send(msg, args.t(languageKeys.commands.misc.shorten.success, { link }));
    }

}