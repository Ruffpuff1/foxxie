import { FoxxieCommand } from 'lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { GithubUserRegex, toTitleCase } from '@ruffpuff/utilities';
import { sendLoading, Urls } from 'lib/util';
import centra from '@foxxie/centra';
import type { GithubUser } from 'lib/types';
import { languageKeys } from 'lib/i18n';
import { FoxxieEmbed } from 'lib/discord';
import { send } from '@sapphire/plugin-editable-commands';
import type { TFunction } from '@sapphire/plugin-i18next';

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['gh'],
    requiredClientPermissions: PermissionFlagsBits.EmbedLinks
})
export class UserCommand extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const user = this.parseUser(await args.pick('string'));
        const loading = await sendLoading(msg);

        const result = await this.fetchResult(user, loading);
        await this.buildEmbed(msg, args.t, result);
        return loading.delete();
    }

    async buildEmbed(msg: Message, t: TFunction, user: GithubUser): Promise<void> {
        const none = toTitleCase(t(languageKeys.globals.none));

        const embed = new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(user.name ? `${user.name} [${user.login}]` : user.login, user.avatar_url, user.html_url)
            .setThumbnail(user.avatar_url)
            .setDescription([
                t(languageKeys.commands.websearch.npmCreated, { created: new Date(user.created_at) }),
                t(languageKeys.commands.websearch.npmUpdated, { updated: new Date(user.updated_at) })
            ]);

        if (user.bio) embed.addField('bio', user.bio);

        embed
            .addField('occupation', user.company || none, true)
            .addField('location', user.location || none, true)
            .addField('website', user.blog || none, true);

        await send(msg, { embeds: [embed] });
    }

    async fetchResult(user: string, loading: Message) {
        const result = <GithubUser>await centra(Urls.Github)
            .path('users')
            .path(user)
            .json();

        if (result.message) {
            await loading.delete();
            this.error('no user');
        }
        return result;
    }

    parseUser(user: string): string {
        const res = GithubUserRegex.exec(user);
        if (!res) return user;
        return res.groups?.login || user;
    }

}