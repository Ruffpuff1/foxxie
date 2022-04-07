const { toTitleCase } = require('@ruffpuff/utilities');
const centra = require('@aero/centra');
const { FoxxieEmbed } = require('#discord');
const { FLAGS } = require('discord.js').Permissions;
const { FoxxieCommand } = require('#structures');
const { sendLoading, sendEmbed } = require('#messages');
const { t, languageKeys } = require('#i18n');
const { animeURL } = require('#utils/Constants');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['kitsu'],
            usage: '<Anime:string>',
            requiredPermissions: [FLAGS.EMBED_LINKS]
        });
    }

    async run(msg, [anime]) {
        const loading = await sendLoading(msg);
        const res = await this.fetchAPI(msg, anime, loading);
        if (res.nsfw && !msg.channel.nsfw) return this.err({ msg, loading, key: this.t.nsfw });

        await this.buildEmbed(msg, res);
        return loading.delete();
    }

    buildEmbed(msg, result) {
        const titles = languageKeys.titles.websearch.anime;

        const embed = new FoxxieEmbed(msg)
            .setThumbnail(this.getThumbnail(result))
            .setAuthor(this.getAuthor(result), null, this.getURL(result))
            .setDescription(result.synopsis ?? result.description)
            .addField(t(msg, titles.aired), this.getDate(result, msg), true)
            .addField(t(msg, titles.status), this.getStatus(result), true)
            .addField(t(msg, titles.type), this.getType(result), true)
            .addField(t(msg, titles.episodes), this.getTotal(result, msg), true)
            .addField(t(msg, titles.duration), this.getDuration(result, msg), true)
            .addField(t(msg, titles.age), this.getAgeRatingGuide(result), true)
            .addField(t(msg, titles.rating), this.getRating(result, msg), true)
            .addField(t(msg, titles.ranking), this.getRanking(result, msg), true)
            .addField(t(msg, titles.popularity), this.getPopularity(result, msg), true);

        return sendEmbed(msg, embed);
    }

    unknown(msg) {
        return toTitleCase(t(msg, languageKeys.globals.unknown));
    }

    getPopularity({ popularityRank, userCount }, msg) {
        return t(msg, this.t.popularity, {
            rank: popularityRank,
            users: userCount.toLocaleString()
        });
    }

    getRanking({ ratingRank }, msg) {
        if (!ratingRank) return this.unknown(msg);
        return t(msg, this.t.ranking, { rank: ratingRank });
    }

    getRating({ averageRating, ratingFrequencies }, msg) {
        const number = Object.values(ratingFrequencies)
            .reduce((acc, item) => {
                item = parseInt(item);
                if (!isNaN(item) && item > 0) return acc += item;
                return acc;
            }, 0);

        if (!averageRating || !number) return this.unknown(msg);

        return t(msg, this.t.rating, {
            average: parseInt(averageRating).toFixed(0),
            total: 100,
            rating: number
        });
    }

    getAgeRatingGuide({ ageRatingGuide }) {
        return `${ageRatingGuide}`;
    }

    getDuration({ episodeLength }, msg) {
        if (!episodeLength) return this.unknown(msg);
        return t(msg, this.t.duration, { length: episodeLength });
    }

    getTotal({ episodeCount }, msg) {
        return t(msg, this.t.count, { count: episodeCount });
    }

    getType({ showType }) {
        return showType;
    }

    getStatus({ status }) {
        return toTitleCase(status);
    }

    getDate({ startDate, endDate }, msg) {
        const date = new Date(Date.parse(startDate));
        const end = new Date(Date.parse(endDate));

        return t(msg, this.t.date, { date, end });
    }

    getThumbnail({ posterImage }) {
        return posterImage.original ? posterImage.original : '';
    }

    getURL({ slug }) {
        return slug ? `https://kitsu.io/anime/${slug}` : '';
    }

    getAuthor({ titles }) {
        if (!titles.en && !titles.en_jp) return '';
        return `${titles.en
            ? `${titles.en}${titles.ja_jp
                ? ` [${titles.ja_jp}]`
                : ''}`
            : `${titles.en_jp}${titles.ja_jp
                ? ` [${titles.ja_jp}]`
                : ''}`}`;
    }

    async fetchAPI(msg, anime, loading) {
        const res = await centra(animeURL)
            .query(`filter[text]`, anime)
            .json();

        if (res.errors) return this.err({ msg, loading, key: this.t.noResults, anime });
        if (res.data[0]?.attributes) return res.data[0].attributes;

        return this.err({ msg, loading, key: this.t.noResults, anime });
    }

    async err({ msg, loading, key, anime }) {
        await loading.delete();
        throw t(msg, key, { anime });
    }

};