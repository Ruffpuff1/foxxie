import centra from '@foxxie/centra';
import { FoxxieCommand } from '../../lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { envIsDefined, Urls, sendLoading } from '../../lib/util';
import type { WebsterResponse } from '../../lib/types';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { languageKeys } from '../../lib/i18n';

@ApplyOptions<FoxxieCommand.Options>({
    enabled: envIsDefined(['WEBSTER_TOKEN']),
    aliases: ['webster'],
    description: languageKeys.commands.websearch.defineDescription,
    detailedDescription: languageKeys.commands.websearch.defineExtendedUsage
})
export class UserCommand extends FoxxieCommand {

    public async messageRun(msg: Message, args: FoxxieCommand.Args): Promise<void> {
        const word = await args.rest('string');

        const loading = await sendLoading(msg);
        const res = await this.fetchResult(word);

        const [definition] = res;

        if (!definition || !definition.def || !definition.fl || !definition.hwi || !definition.hwi.prs) {
            await loading.delete();
            this.error(languageKeys.commands.websearch.defineNotFound, { word });
        }

        await send(msg, [
            [
                `(${[definition.fl, ...definition?.lbs || []].join(', ')})`,
                `**${definition.hwi?.hw?.replace(/\*/g, '\\*')}**`,
                `[${definition.hwi?.prs?.[0]?.mw}]`
            ].join(' '),
            definition.def
                .map(def => def.sseq.flat(1)
                    .map(sseq => sseq[1])
                    .filter(sense => sense.dt)
                    .map(sense => {
                        const output = [];
                        if (!sense) return null;
                        const definitions = sense.dt.find(text => text[0] === 'text');

                        if (definitions) {
                            const parsed = (definitions as unknown as string[])[1].replace(/{.+?}/g, '');
                            if (parsed.replace(/\W+/g, '').length === 0) return false;
                            output.push(`- ${parsed.trim()}`);
                        }
                        return output[0];
                    })
                    .filter(i => !!i)
                    .slice(0, 3)
                    .join('\n')
                )
                .slice(0, 3)
                .join('\n')
        ].join('\n'));
        await loading.delete();
    }

    private async fetchResult(word: string): Promise<WebsterResponse[]> {
        return <WebsterResponse[]><unknown>centra(Urls.Webster)
            .path(word)
            .query('key', process.env.WEBSTER_TOKEN)
            .json();
    }

}