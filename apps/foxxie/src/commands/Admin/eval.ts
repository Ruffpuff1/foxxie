/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { isThenable } from '@sapphire/utilities';
// @ts-expect-error unused vars for eval
import { readSettings, writeSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { Urls } from '#utils/constants';
import { codeBlock, Message } from 'discord.js';
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
	description: LanguageKeys.Commands.Admin.EvalDescription,
	flags: [...msgFlags, 'showHidden', 'sh', 's', 'silent', 'a', 'async'],
	guarded: true,
	options: [...depthOptions, ...langOptions, 'output'],
	permissionLevel: PermissionLevels.BotOwner,
	quotes: [],
	usage: '[code]'
})
export class UserCommand extends FoxxieCommand {
	public async messageRun(message: Message, args: FoxxieCommand.Args): Promise<void> {
		const code = await args.rest('string');
		const { result, success, time, type } = await this.eval(message, args, code);

		const formatted = codeBlock(args.getOption(...langOptions) ?? 'js', result);

		const footer = codeBlock('ts', type.toString());
		let output = args.t(LanguageKeys.Commands.Admin[`Eval${success ? 'Output' : 'Error'}`], {
			output: formatted,
			time,
			type: footer
		});

		if (args.getFlags('s', 'silent')) return;
		if (args.getOption('output') === OutputType.Console) {
			// eslint-disable-next-line no-console
			console.log(result);
			await send(
				message,
				args.t(LanguageKeys.Commands.Admin.EvalConsole, {
					footer,
					name: hostname(),
					output: formatted,
					time
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
					footer,
					output: `${Urls.Haste}/share/${key}`,
					time
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
			result,
			success,
			time: this.formatTime(syncTime, asyncTime),
			type
		};
	}

	private formatTime(syncTime: string, asyncTime: string | undefined): string {
		return asyncTime ? `⏱ ${asyncTime} <${syncTime}>` : `⏱ ${syncTime}`;
	}
}
