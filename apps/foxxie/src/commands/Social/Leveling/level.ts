import { SocialCommand } from '#lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from '#lib/types';
import type { GuildMember } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { assetsFolder, BrandingColors } from '#utils/constants';
import { Canvas, resolveImage, Image, rgba } from 'canvas-constructor/skia';
import { join } from 'node:path';
import type { TFunction } from '@foxxie/i18n';
import { LanguageKeys } from '#lib/i18n';
import { RequireLevelingEnabled } from '#utils/decorators';
import { sendLoadingMessage, xpNeeded } from '#utils/util';
import { seconds } from '@ruffpuff/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { sanitizeInput } from '#utils/transformers';
import { LeaderboardType } from '#utils/Leaderboard';

@ApplyOptions<SocialCommand.Options>({
    aliases: ['lvl', 'rank'],
    cooldownDelay: seconds(10),
    description: LanguageKeys.Commands.Social.LevelDescription,
    detailedDescription: LanguageKeys.Commands.Social.LevelDetailedDescription,
    requiredClientPermissions: PermissionFlagsBits.AttachFiles
})
export class UserCommand extends SocialCommand {
    private darkThemeTemplate: Image = null!;

    private lightThemeTemplate: Image = null!;

    @RequireLevelingEnabled()
    public async messageRun(msg: GuildMessage, args: SocialCommand.Args): Promise<void> {
        await sendLoadingMessage(msg);
        const member = await args.pick('member').catch(() => msg.member);

        const img = await this.printImage(member, args.t);
        await send(msg, { files: [{ attachment: img, name: 'level.png' }] });
    }

    public async onLoad(): Promise<void> {
        [this.darkThemeTemplate, this.lightThemeTemplate] = await Promise.all([
            new Canvas(640, 174)
                .setShadowColor(rgba(0, 0, 0, 0.7))
                .setShadowBlur(7)
                .setColor('#202225')
                .createRoundedPath(10, 10, 620, 154, 8)
                .fill()
                .createRoundedClip(10, 10, 620, 154, 5)
                .clearRectangle(10, 10, 186, 154)
                .printCircle(103, 87, 70)
                .resetShadows()
                .setColor('#2C2F33')
                .printRoundedRectangle(212, 89, 300, 33, 9)
                .png()
                .then(resolveImage),
            new Canvas(640, 174)
                .setShadowColor(rgba(0, 0, 0, 0.7))
                .setShadowBlur(7)
                .setColor('#FFFFFF')
                .createRoundedPath(10, 10, 620, 154, 8)
                .fill()
                .createRoundedClip(10, 10, 620, 154, 5)
                .clearRectangle(10, 10, 186, 154)
                .printCircle(103, 87, 70)
                .resetShadows()
                .setColor('#E8E8E8')
                .printRoundedRectangle(212, 89, 300, 33, 9)
                .png()
                .then(resolveImage)
        ]);
    }

    private async printImage(member: GuildMember, t: TFunction): Promise<Buffer> {
        const memberEntity = await this.container.db.members.ensure(member.id, member.guild.id);
        const user = await this.container.db.users.ensureProfile(member.id);
        const { points, level } = memberEntity;
        const isLight = !user.profile.darkmode;

        const icon = user.profile.background;
        const nextLevel = xpNeeded(level + 1);

        const diff = nextLevel - points;
        const progressBar = Math.max(Math.round((points / nextLevel) * 296), 10);
        const position = await this.getPosition(member);

        return new Canvas(640, 174)
            .save()
            .createRoundedClip(10, 10, 620, 154, 8)
            .printImage(await resolveImage(join(assetsFolder, 'social', 'backgrounds', `${icon ?? 'Wood'}.png`)), 9, 9, 189, 157)
            .restore()
            .printImage(isLight ? this.lightThemeTemplate : this.darkThemeTemplate, 0, 0, 640, 174)

            .setColor(`#${(user.profile.color || member.displayColor || BrandingColors.Primary).toString(16).padStart(6, '0')}`)
            .printRoundedRectangle(212, 89, progressBar, 27, 8)

            .printRoundedRectangle(622, 10, 10, 153, 4)
            .restore()

            .setColor(isLight ? '#171717' : '#F0F0F0')
            .setTextFont('13px Cousine-Bold')

            .setTextAlign('left')
            .printText(`${t(LanguageKeys.Commands.Social.Level)} ${level}`, 212, 75)
            .printText(`${compact(Math.round(diff), t)} ${t(LanguageKeys.Commands.Social.LevelRemaining)}`, 212, 140)

            .setTextAlign('right')
            .printText(t(LanguageKeys.Commands.Social.LevelRanked, { position }), 480, 140)
            .printText(`${compact(points, t)} / ${compact(nextLevel, t)} XP`, 480, 75)

            .setTextAlign('left')
            .setTextFont('28px Cousine-Bold')
            .printText(sanitizeInput(member.displayName), 210, 55)

            .save()
            .printCircularImage(await resolveImage(member.displayAvatarURL({ size: 256, format: 'png' })), 103, 87, 71)
            .restore()
            .png();
    }

    private async getPosition(member: GuildMember): Promise<number> {
        const lb = await this.client.leaderboard.fetch(LeaderboardType.Local, member.guild.id);
        const rank = lb.get(member.id);
        return rank ? rank.position : lb.size;
    }
}

function compact(value: number, t: TFunction) {
    return t(LanguageKeys.Globals.NumberCompact, { value });
}
