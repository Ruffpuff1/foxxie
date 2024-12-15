import { EventArgs, Events } from '#lib/types';
import { Schedules } from '#utils/constants';
import { isDisboard } from '#utils/Discord';
import { hours, isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
    event: Events.BotMessage,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.BotMessage> {
    private disboardRegex =
        /(?<prefix>Bump\sdone)!?\s:thumbsup:\s+Check\sit\sout\s\[on\sDISBOARD]\(https:\/\/disboard\.org(\/servers?)?(\/?(?<serverId>\d{17,19}))?\)\.?$/;

    public async run(...[msg]: EventArgs<Events.BotMessage>): Promise<void> {
        if (!isDisboard(msg)) return;

        const [embed] = msg.embeds;
        /* test to make sure the embed is a success embed. */
        if (!this.disboardRegex.test(embed?.description as string)) return;

        /* be sure to account for possible double bumps */

        await this.container.schedule.add(Schedules.Disboard, hours(2) + Date.now(), {
            data: { guildId: msg.guild.id }
        });
    }
}
