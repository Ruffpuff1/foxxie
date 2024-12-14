import { ApplyOptions } from '@sapphire/decorators';
import { ModerationActions } from '#lib/moderation';
import { ManualModerationListener } from '#lib/Structures/listeners/ManualModerationListener';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { getLogger } from '#utils/functions';

@ApplyOptions<ManualModerationListener.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	event: FoxxieEvents.GuildMemberUpdateRolesManualMute
}))
export class UserListener extends ManualModerationListener<FoxxieEvents.GuildMemberUpdateRolesManualMute> {
	public async run(...[member]: EventArgs<FoxxieEvents.GuildMemberUpdateRolesManualMute>) {
		const logger = getLogger(member);

		const actionByFoxxie = logger.mute.isSet(member.id);
		console.log(actionByFoxxie, 'by fox');
		if (actionByFoxxie) return;

		const controller = new AbortController();
		const contextPromise = logger.mute.wait(member.id, controller.signal);

		const context = await contextPromise;
		console.log(context, 'ctx');
		if (!context) return;

		await ModerationActions.mute.applyManual(member.guild, this.getOptions(context, member), await this.fetchDMContext(member, context!.userId));
	}
}
