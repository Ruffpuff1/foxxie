import { Args } from '@sapphire/framework';
import { readSettings, readSettingsPermissionNodes } from '#lib/database';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { sendMessage } from '#utils/functions';
import { GuildMember, Role } from 'discord.js';

export class PermissionCommand extends FoxxieCommand {
	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		const settings = await readSettings(message.guild);
		const nodes = readSettingsPermissionNodes(settings);
		const target = await PermissionCommand.ResolveTarget(args);
		const content = nodes.display(target);
		await sendMessage(message, content);
	}

	private static async ResolveTarget(args: FoxxieCommand.Args): Promise<GuildMember | Role> {
		return args.pick(PermissionCommand.NodeTarget).catch(() => args.message.member!);
	}

	protected static NodeTarget = Args.make<GuildMember | Role>(async (parameter, context) => {
		if (['*', 'everyone'].includes(parameter.toLowerCase())) {
			return Args.ok(context.message.guild!.roles.cache.find((r) => r.id === r.guild.id)!);
		}

		const roleResult = await context.args.pick('role').catch(() => null);
		if (roleResult) return Args.ok(roleResult);

		const memberResult = await context.args.pick('member').catch(() => context.message.member!);
		return Args.ok(memberResult);
	});
}
