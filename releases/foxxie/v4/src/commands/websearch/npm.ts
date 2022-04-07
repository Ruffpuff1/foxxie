import { PermissionFlagsBits } from 'discord-api-types/v9';
import { FoxxieEmbed } from 'lib/discord';
import centra from '@foxxie/centra';
import { FoxxieCommand } from 'lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import { sendLoading, Urls } from 'lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import type { NpmPackage, NpmResult } from 'lib/types';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from 'lib/i18n';
import { toTitleCase } from '@ruffpuff/utilities';

const LOGO = 'https://cdn.ruff.cafe/foxxie/npm-logo.png';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['yarn'],
    description: languageKeys.commands.websearch.npmDescription,
    detailedDescription: languageKeys.commands.websearch.npmExtendedUsage,
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const pack = await args.pick('cleanString');
        const loading = await sendLoading(msg);
        const data = <NpmResult>await centra(`${Urls.Npm}${pack}`).json();

        if (data.error || data.code === 'MethodNotAllowedError') {
            await loading.delete();
            this.error(languageKeys.commands.websearch.npmNoResults, { pack });
        }

        const latest = data.versions[data['dist-tags'].latest];
        const titles = args.t(languageKeys.commands.websearch.npmTitles);
        const none = toTitleCase(args.t(languageKeys.globals.none));

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setThumbnail(LOGO)
            .setAuthor(`${data.name} [v${data['dist-tags'].latest}]`, LOGO, `${Urls.Npm}${pack}`)
            .setDescription([
                args.t(languageKeys.commands.websearch.npmCreated, { created: new Date(data.time.created) }),
                args.t(languageKeys.commands.websearch.npmUpdated, { updated: new Date(data.time[data['dist-tags'].latest]) })
            ])
            .addField(titles.description, latest.description)
            .addField(titles.main, latest.main, true)
            .addField(titles.author, latest.author?.name || latest.maintainers[0]?.name || none, true)
            .addField(titles.license, latest.license, true)
            .addField(titles.maintainers, latest.maintainers.map(maintainer => `[${maintainer.name}](https://www.npmjs.com/~${maintainer.name})`).join(', '))
            .addField(titles.dependencies, this.formatDeps(latest, args.t));

        await send(msg, { embeds: [embed] });
        return loading.delete();
    }

    formatDeps(latest: NpmPackage, t: TFunction) {
        if (!latest.dependencies) return t(languageKeys.commands.websearch.npmNoDependencies);
        return Object.keys(latest.dependencies).join(', ');
    }

}