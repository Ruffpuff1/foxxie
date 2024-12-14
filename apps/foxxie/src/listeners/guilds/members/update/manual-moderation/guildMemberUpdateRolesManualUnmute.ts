import { ApplyOptions } from '@sapphire/decorators';
import { ModerationActions } from '#lib/moderation';
import { ManualModerationListener } from '#lib/Structures/listeners/ManualModerationListener';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getLogger } from '#utils/functions';

@ApplyOptions<ManualModerationListener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdateRolesManualUnmute
}))
export class UserListener extends ManualModerationListener<FoxxieEvents.GuildMemberUpdateRolesManualUnmute> {
	public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberUpdateRolesManualUnmute>) {
		const logger = getLogger(member);

		const actionByFoxxie = logger.unmute.isSet(member.id);
		if (actionByFoxxie) return;

		const controller = new AbortController();
		const contextPromise = logger.unmute.wait(member.id, controller.signal);

		const context = await contextPromise;
		if (!context) return;

		await ModerationActions.mute.undoManual(member.guild, this.getOptions(context, member), await this.fetchDMContext(member, context.userId));
	}
}
