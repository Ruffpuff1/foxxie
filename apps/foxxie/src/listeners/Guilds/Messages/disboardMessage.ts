import { EventArgs, FoxxieEvents } from '#lib/Types';
import { Schedules } from '#utils/constants';
import { isDisboard } from '#utils/Discord';
import { cast, hours, isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    event: FoxxieEvents.BotMessage,
    enabled: !isDev()
})
export class UserListener extends Listener<FoxxieEvents.BotMessage> {
    private disboardRegex =
        /(?<prefix>Bump\sdone)!?\s:thumbsup:\s+Check\sit\sout\s\[on\sDISBOARD]\(https:\/\/disboard\.org(\/servers?)?(\/?(?<serverId>\d{17,19}))?\)\.?$/;

    public async run(...[msg]: EventArgs<FoxxieEvents.BotMessage>): Promise<void> {
        if (!isDisboard(msg)) return;

        const [embed] = msg.embeds;
        /* test to make sure the embed is a success embed. */
        if (!this.disboardRegex.test(cast<string>(embed?.description))) return;

        /* be sure to account for possible double bumps */

        await this.container.schedule.add(Schedules.Disboard, hours(2) + Date.now(), {
            data: { guildId: msg.guild.id }
        });
    }
}
