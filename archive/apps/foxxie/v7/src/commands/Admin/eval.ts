/* eslint-disable @typescript-eslint/no-unused-vars */
import { LanguageKeys } from '#lib/I18n';
import { FoxxieCommand } from '#lib/Structures';
import { PermissionLevels } from '#lib/Types';
import { Urls } from '#utils/constants';
import { isThenable } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import Type from '@sapphire/type';
import { codeBlock } from '@sapphire/utilities';
import { Message } from 'discord.js';
import { hostname } from 'node:os';
import { inspect } from 'node:util';

const langOptions = ['lang', 'lng'];
const depthOptions = ['depth', 'd'];
const msgFlags = ['msg', 'message', 'm'];

const enum OutputType {
    Console = 'console',
    Paste = 'paste'
}

@ApplyOptions<FoxxieCommand.Options>({
    aliases: ['ev'],
    options: [...depthOptions, ...langOptions, 'output'],
    quotes: [],
    permissionLevel: PermissionLevels.BotOwner,
    flags: [...msgFlags, 'showHidden', 'sh', 's', 'silent', 'a', 'async'],
    description: LanguageKeys.Commands.Admin.EvalDescription,
    usage: '[code]',
    guarded: true
})
export class UserCommand extends FoxxieCommand {
    public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<void> {
        const code = await args.rest('string');
        const { success, result, time, type } = await this.eval(message, args, code);

        const formatted = codeBlock(args.getOption(...langOptions) ?? 'js', result);

        const footer = codeBlock('ts', type.toString());
        let output = args.t(LanguageKeys.Commands.Admin[`Eval${success ? 'Output' : 'Error'}`], {
            time,
            output: formatted,
            type: footer
        });

        if (args.getFlags('s', 'silent')) return;
        if (args.getOption('output') === OutputType.Console) {
            // eslint-disable-next-line no-console
            console.log(result);
            await send(
                message,
                args.t(LanguageKeys.Commands.Admin.EvalConsole, {
                    time,
                    output: formatted,
                    footer,
                    name: hostname()
                })
            );
            return;
        }

        if (output.length > 2000 || args.getOption('output') === OutputType.Paste) {
            const key = await this.container.apis.hastebin.post(result);
            if (args.getFlags(...msgFlags)) {
                output = `${Urls.Haste}/share/${key}`;
                await send(message, output);
                return;
            }
            await send(
                message,
                args.t(LanguageKeys.Commands.Admin.EvalHaste, {
                    time,
                    output: `${Urls.Haste}/share/${key}`,
                    footer
                })
            );
            return;
        }

        if (args.getFlags(...msgFlags)) output = result;
        await send(message, output);
    }

    private async eval(message: Message, args: FoxxieCommand.Args, code: string) {
        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        const { guild } = message;
        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        const { client } = this.container;
        // @ts-expect-error value is never read, this is so `msg` is possible as an alias when sending the eval.
        const msg = message;

        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        const stopwatch = new Stopwatch();
        // eslint-disable-next-line one-var
        let asyncTime, result, success, syncTime;
        // eslint-disable-next-line one-var
        let hasThen = false;
        let type: Type;

        try {
            if (args.getFlags('a', 'async')) code = `(async () => {\n${code}\n})();`;

            // eslint-disable-next-line no-eval
            result = eval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);
            if (isThenable(result)) {
                hasThen = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (error) {
            if (!syncTime) syncTime = stopwatch.toString();
            type = new Type(error);
            if (hasThen && !asyncTime) asyncTime = stopwatch.toString();
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string' && args.getOption('output') !== OutputType.Console) {
            result = inspect(result, {
                depth: Number(args.getOption(...depthOptions) ?? 0) || 0,
                showHidden: args.getFlags('showHidden', 'sh')
            });
        }

        return {
            success,
            type,
            time: this.formatTime(syncTime, asyncTime),
            result
        };
    }

    private formatTime(syncTime: string, asyncTime: string | undefined): string {
        return asyncTime ? `⏱ ${asyncTime} <${syncTime}>` : `⏱ ${syncTime}`;
    }
}
