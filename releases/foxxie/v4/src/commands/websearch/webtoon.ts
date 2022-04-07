import { sendLoading, Urls, envIsDefined } from '../../lib/util';
import type { WebtoonInfo, WebtoonResult, WebtoonCodeQ } from '../../lib/types';
import { FoxxieCommand } from '../../lib/structures';
import { languageKeys } from '../../lib/i18n';
import { ApplyOptions } from '@sapphire/decorators';
import { Message, Permissions } from 'discord.js';
import fetch from '@foxxie/centra';
import type { TFunction } from '@sapphire/plugin-i18next';
import { FoxxieEmbed } from '../../lib/discord';
import { send } from '@sapphire/plugin-editable-commands';

const formatFullImgLink = (link: string) => `${Urls.WebtoonImage}${link}`;

const clean = (str: string) => str.replace(/&#39;/g, '\'');

@ApplyOptions<FoxxieCommand.Options>({
    enabled: envIsDefined(['RAPID_API_TOKEN', 'WEBTOON_USER_AGENT']),
    aliases: ['wt'],
    description: languageKeys.commands.websearch.webtoonDescription,
    detailedDescription: languageKeys.commands.websearch.webtoonExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.EMBED_LINKS]
})
export default class extends FoxxieCommand {

    async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        const search = await args.rest('string');

        const [code, buffer] = await this.getQCode(search, args, loading);
        const [data, attachment] = await Promise.all([this.getData(code as number), this.getImage(buffer as string)]);

        const embed = await this.prepareEmbed(msg, args.t, data);

        await send(msg, { embeds: [embed], files: [{ attachment, name: 'webtoon.png' }] });
        return loading.delete();
    }

    async prepareEmbed(msg: Message, t: TFunction, data: WebtoonInfo): Promise<FoxxieEmbed> {
        const titles = t(languageKeys.commands.websearch.webtoonTitles);

        return new FoxxieEmbed(msg)
            .setColor(await this.container.db.fetchColor(msg))
            .setAuthor(`${clean(data.title)}`, 'attachment://webtoon.png', data.linkUrl)
            .setThumbnail('attachment://webtoon.png')
            .setDescription(clean(data.synopsis))
            .addField(titles.author, data.writingAuthorName, true)
            .addField(titles.genre, data.genreInfo.name, true)
            .addField(titles.total, `${t(languageKeys.globals.numberFormat, { value: data.totalServiceEpisodeCount })}`, true)
            .addField(titles.average, `${t(languageKeys.globals.numberFormat, { value: data.starScoreAverage })}`, true)
            .addField(titles.read, `${t(languageKeys.globals.numberFormat, { value: data.readCount })}`, true)
            .addField(titles.favorite, `${t(languageKeys.globals.numberFormat, { value: data.favoriteCount })}`, true);
    }

    async getData(code: number): Promise<WebtoonInfo> {
        const { message } = await fetch(Urls.WebtoonInfo)
            .header('x-rapidapi-key', process.env.RAPID_API_TOKEN as string)
            .query({ titleNo: `${code}`, language: 'en' })
            .json() as WebtoonResult;

        return message?.result?.titleInfo;
    }

    async getImage(link: string): Promise<Buffer> {
        const fullLink = formatFullImgLink(link);
        return fetch(fullLink)
            .header(`referer`, Urls.WebtoonReferer)
            .header(`User-Agent`, process.env.WEBTOON_USER_AGENT as string)
            .raw();
    }

    async getQCode(search: string, args: FoxxieCommand.Args, loading: Message): Promise<(string | number)[]> {
        const res = await fetch(Urls.WebtoonId)
            .header('x-rapidapi-key', process.env.RAPID_API_TOKEN as string)
            .query(`query`, search)
            .json() as WebtoonCodeQ;

        const result = res?.message?.result?.challengeSearch?.titleList?.[0];
        if (!result || !result.titleNo) {
            await loading.delete();
            this.error(languageKeys.commands.websearch.webtoonNotFound, { ...args.commandContext, search });
        }
        return [result.titleNo, result.thumbnail];
    }

}