import { FoxxieCommand } from '../../lib/structures';
import { send } from '@sapphire/plugin-editable-commands';
import type { GuildMessage } from '../../lib/types/Discord';
import { GuildMember, Message, Permissions } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { readdirSync } from 'fs';
import { BrandingColors, sendLoading, SOCIAL_FOLDER } from '../../lib/util';
import { Canvas, resolveImage, Image, rgba } from 'canvas-constructor/skia';
import { join } from 'path';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '../../lib/i18n';

function readFiles() {
    return readdirSync('assets/social').filter(file => file.endsWith('.jpg'));
}

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['lvl', 'rank'],
    description: languageKeys.commands.leveling.levelDescription,
    detailedDescription: languageKeys.commands.leveling.levelExtendedUsage,
    requiredClientPermissions: [Permissions.FLAGS.ATTACH_FILES],
    flags: ['light']
})
export default class extends FoxxieCommand {

    public imgFiles = readFiles();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    private darkThemeTemplate: Image = null!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    private lightThemeTemplate: Image = null!;

    async messageRun(msg: GuildMessage, args: FoxxieCommand.Args): Promise<Message> {
        const loading = await sendLoading(msg);
        const member = await args.pick('member').catch(() => msg.member);

        const img = await this.printImage(member, args);
        await send(msg, { files: [{ attachment: img, name: 'level.png' }] });
        return loading.delete();
    }

    async printImage(member: GuildMember, args: FoxxieCommand.Args): Promise<Buffer> {
        const memberEntity = await this.container.db.members.ensure(member.id, member.guild.id);
        const { points } = memberEntity;
        const light = args.getFlags('light');

        const level = Math.floor(0.2 * Math.sqrt(points));
        const nextLevel = Math.floor(((level + 1) / 0.2) ** 2);
        const progressBar = Math.max((points / nextLevel) * 296, 10);

        return new Canvas(640, 174)
            .save()
            .createRoundedClip(10, 10, 620, 154, 8)
            .printImage((await resolveImage(join(SOCIAL_FOLDER, 'Viewpoint.jpg'))), 9, 9, 189, 157)
            .restore()
            .printImage(light ? this.lightThemeTemplate : this.darkThemeTemplate, 0, 0, 640, 174)

            .setColor(`#${(member.displayColor || BrandingColors.Primary).toString(16).padStart(6, '0')}`)
            .printRoundedRectangle(212, 89, progressBar, 27, 8)

            .printRoundedRectangle(622, 10, 10, 153, 4)
            .restore()

            .setColor(light ? '#171717' : '#F0F0F0')
            .setTextFont('13px RobotoSlab')

            .setTextAlign('left')
            .printText(`${args.t(languageKeys.commands.leveling.level)} ${level}`, 212, 75)

            .setTextAlign('right')
            .printText(`${compact(points, args.t)} / ${compact(nextLevel, args.t)} XP`, 480, 75)

            .setTextAlign('left')
            .setTextFont('28px RobotoSlab')
            .printText(member.displayName, 210, 55)

            .save()
            .printCircularImage(await resolveImage(member.displayAvatarURL({ size: 256, format: 'png' })), 103, 87, 71)
            .restore()
            .png();
    }

    async onLoad(): Promise<void> {
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

}

function compact(value: number, t: TFunction) {
    return t(languageKeys.globals.numberCompact, { value });
}
