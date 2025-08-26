import { sanitize } from '@foxxiebot/sanitize';
import { send } from '@sapphire/plugin-editable-commands';
import { Command } from '#Foxxie/Core';
import { ensureMember } from '#lib/database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { FTFunction } from '#lib/types';
import { assetsFolder, BrandingColors } from '#utils/constants';
import { sendLoadingMessage } from '#utils/functions';
import { Leaderboard, LeaderboardType } from '#utils/Leaderboard';
import { xpNeeded } from '#utils/util';
import { Canvas, Image, resolveImage, rgba } from 'canvas-constructor/skia';
import { GuildMember, PermissionFlagsBits } from 'discord.js';
import { join } from 'path';

function compact(value: number, t: FTFunction) {
	return t(LanguageKeys.Globals.NumberCompact, { value });
}

export class LevelingCommands {
	@Command((command) =>
		command
			.setAliases('lvl', 'rank')
			.setCategory('social')
			.setDescription(LanguageKeys.Commands.General.Avatar.Description)
			.setDetailedDescription(LanguageKeys.Commands.General.Avatar.DetailedDescription)
			.setRequiredClientPermissions(PermissionFlagsBits.AttachFiles)
			.setRequiredUserPermissions(PermissionFlagsBits.AttachFiles)
	)
	public static async Level(...[message, args]: FoxxieCommand.MessageRunArgs) {
		await sendLoadingMessage(message);
		const member = await args.pick('member').catch(() => message.member);

		const img = await LevelingCommands.PrintLevelCard(member, args.t);
		await send(message, { content: null, embeds: [], files: [{ attachment: img, name: 'level.png' }] });
	}

	private static async GetLeaderboardPosition(member: GuildMember): Promise<number> {
		const lb = await Leaderboard.Fetch(LeaderboardType.Local, member.guild.id);
		const rank = lb.get(member.id);
		return rank ? rank.position : lb.size;
	}

	private static async PrintLevelCard(member: GuildMember, t: FTFunction): Promise<Buffer> {
		const entity = await ensureMember(member.id, member.guild.id);
		const { level, points } = entity;

		const icon = 'Wood';
		const nextLevel = xpNeeded(level + 1);

		const diff = nextLevel - points;
		const progressBar = Math.max(Math.round((points / nextLevel) * 296), 10);
		const position = await LevelingCommands.GetLeaderboardPosition(member);

		const template =
			LevelingCommands.DarkThemeTemplate ??
			(await new Canvas(640, 174)
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
				.pngAsync()
				.then(resolveImage));

		if (template) LevelingCommands.DarkThemeTemplate = template;

		return new Canvas(640, 174)
			.save()
			.createRoundedClip(10, 10, 620, 154, 8)
			.printImage(await resolveImage(join(assetsFolder, 'social', 'backgrounds', `${icon ?? 'Wood'}.png`)), 9, 9, 189, 157)
			.restore()
			.printImage(LevelingCommands.DarkThemeTemplate!, 0, 0, 640, 174)

			.setColor(`#${(member.displayColor || BrandingColors.Primary).toString(16).padStart(6, '0')}`)
			.printRoundedRectangle(212, 89, progressBar, 27, 8)

			.printRoundedRectangle(622, 10, 10, 153, 4)
			.restore()

			.setColor('#F0F0F0')
			.setTextFont('13px Cousine-Bold')

			.setTextAlign('left')
			.printText(`Level ${level}`, 212, 75)
			.printText(`${compact(Math.round(diff), t)} Remaining`, 212, 140)

			.setTextAlign('right')
			.printText(`Ranked #${position}`, 480, 140)
			.printText(`${compact(points, t)} / ${compact(nextLevel, t)} XP`, 480, 75)

			.setTextAlign('left')
			.setTextFont('28px Cousine-Bold')
			.printText(sanitize(member.displayName), 210, 55)

			.save()
			.printCircularImage(await resolveImage(member.displayAvatarURL({ size: 256 })), 103, 87, 71)
			.restore()
			.png();
	}

	private static DarkThemeTemplate: Image | null = null;
}
