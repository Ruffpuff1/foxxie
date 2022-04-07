import { Stopwatch } from '@sapphire/stopwatch';
import { inspect } from 'util';
import { getHaste, Urls } from '../../lib/util';
import { languageKeys } from '../../lib/i18n';
import { FoxxieCommand } from '../../lib/structures/commands';
import { isThenable } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Formatters, Message } from 'discord.js';

const NL = '!!NL!!';
const NL_PATTERN = new RegExp(NL, 'g');

type EvalData = {
    success: boolean;
    result: string;
    time: string;
    type: string;
}

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['ev'],
    options: ['depth', 'd', 'lang', 'lng'],
    ownerOnly: true,
    flags: ['msg', 'm', 'showHidden', 'sh', 's', 'silent', 'a', 'async'],
    description: languageKeys.commands.system._eval.description,
    detailedDescription: languageKeys.commands.system._eval.extendedUsage
})
export default class extends FoxxieCommand {

    _sensitivePattern: unknown;

    public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<Message | null> {
        const code: string = await args.rest('string');

        const { success, result, time, type } = await this.eval(message, args, code);
        const footer = Formatters.codeBlock('ts', type.toString());
        let output = args.t(languageKeys.commands.system._eval[success ? 'output' : 'error'], {
            time,
            output: Formatters.codeBlock(args.getOption('lang', 'lng') ?? 'js', result),
            type: footer });
        if (args.getFlags('s', 'silent')) return null;

        if (output.length > 2000) {
            const key = await getHaste(result);
            return send(message, args.t(languageKeys.commands.system._eval.haste, { time, output: `${Urls.Haste}/${key}`, footer }));
        }

        if (args.getFlags('m', 'msg')) output = result;
        return send(message, output);
    }

    async eval(message: Message, args: FoxxieCommand.Args, code: string): Promise<EvalData> {
        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { guild } = message, { client } = this.container, msg = message;
        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        const stopwatch = new Stopwatch(0);
        let asyncTime, result, success, syncTime;
        let thenable = false, type;

        try {
            if (args.getFlags('a', 'async')) code = `(async () => {\n${code}\n})();`;
            // eslint-disable-next-line no-eval
            result = eval(code);
            syncTime = stopwatch.toString();
            type = 'any'; // new Type(result);
            if (isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (error) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (!type) type = 'error';// type = new Type(error);
            if (thenable && !asyncTime) asyncTime = stopwatch.toString();
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: Number(args.getOption('depth', 'd') ?? 0) || 0,
                showHidden: args.getFlags('showHidden', 'sh')
            });
        }
        result = result
            .replace(NL_PATTERN, '\n')
            .replace(this.sensitivePattern ?? '', '「Rｅｄａｃｔｅｄ」');
        return { success, type, time: this.formatTime(syncTime, asyncTime as string), result };
    }

    formatTime(syncTime: string, asyncTime: string): string {
        return asyncTime ? `⏱ ${asyncTime} <${syncTime}>` : `⏱ ${syncTime}`;
    }

    get sensitivePattern(): RegExp {
        if (!this._sensitivePattern) {
            const token = this.container.client.token?.split('').join('[^]{0,2}');
            const revToken = this.container.client.token?.split('').reverse().join('[^]{0,2}');
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(`${token}|${revToken}`, 'g') });
        }
        return this._sensitivePattern as RegExp;
    }

}