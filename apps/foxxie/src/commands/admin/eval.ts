import type { Message } from 'discord.js';

import { bold } from '@discordjs/builders';
import { ZeroWidthSpace } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { Stopwatch } from '@sapphire/stopwatch';
import Type from '@sapphire/type';
import { cast, codeBlock, isThenable } from '@sapphire/utilities';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { createReferPromise } from '#utils/common';
import { clean } from 'confusables';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';
import { createContext, Script } from 'node:vm';

@ApplyOptions<FoxxieCommand.Options>({
	aliases: ['ev'],
	description: LanguageKeys.Commands.Admin.Eval.Description,
	detailedDescription: LanguageKeys.Commands.Admin.Eval.DetailedDescription,
	flags: ['async', 'no-timeout', 'json', 'silent', 'showHidden', 'hidden', 'sql', 'message', 'msg'],
	options: ['timeout', 'wait', 'lang', 'language', 'depth', 'd'],
	permissionLevel: PermissionLevels.BotOwner,
	quotes: []
})
export class UserCommand extends FoxxieCommand {
	#cachedEvalContext: null | object = null;
	private readonly kTimeout = 60000;

	public override async messageRun(message: Message, args: FoxxieCommand.Args) {
		const code = await args.rest('string');

		const wait = args.getOption('timeout', 'wait');
		const flagTime = args.getFlags('no-timeout') ? Infinity : wait === null ? this.kTimeout : Number(wait);
		const executeSql = args.getFlags('sql');
		const language = args.getOption('lang', 'language') ?? (executeSql || args.getFlags('json') ? 'json' : 'js');
		const { length, result, success, time, type } = executeSql ? await this.sql(code) : await this.eval(message, args, code, flagTime);

		if (args.getFlags('silent')) {
			if (!success && result && cast<Error>(result).stack) this.container.logger.fatal(cast<Error>(result).stack);
			return null;
		}

		if (args.getFlags('message', 'msg')) {
			return send(message, result || ZeroWidthSpace);
		}

		const body = codeBlock(language, result || ZeroWidthSpace);
		const header = `${bold(success ? 'Output' : 'Error')}:`;
		const lengthHeader = length ? `.length: ${args.t(LanguageKeys.Globals.NumberFormat, { value: length })}` : '';
		const typeHeader = `\n${bold('Type')}:${codeBlock('ts', `${type.toString()}${lengthHeader}`)}`;
		// If the sum of the length between the header and the body exceed 2000 characters, send as file:
		if ([...header, ...body, ...typeHeader].length > 2000) {
			const file = { attachment: Buffer.from(result, 'utf8'), name: `output.${language}` } as const;
			return send(message, { content: `${typeHeader}\n${header} ${time}`, files: [file] });
		}

		// Otherwise send as a single message:
		return send(message, `${header}${body}${typeHeader}\n${time}`);
	}

	private async eval(message: Message, args: FoxxieCommand.Args, code: string, timeout: number): Promise<EvalResult> {
		if (timeout === Infinity || timeout === 0) return this.runEval(message, args, code, null, undefined);

		const controller = new AbortController();
		const sleepPromise = createReferPromise<EvalResult>();
		const timer = setTimeout(() => {
			controller.abort();
			sleepPromise.resolve({
				result: 'timeout',
				success: false,
				time: '⏱ ...',
				type: new Type(sleepPromise)
			});
		}, timeout);
		return Promise.race([this.runEval(message, args, code, controller.signal, timeout).finally(() => clearTimeout(timer)), sleepPromise.promise]);
	}

	private async fetchContext() {
		if (!this.#cachedEvalContext) {
			this.#cachedEvalContext = {
				...globalThis,
				__dirname: fileURLToPath(new URL('.', import.meta.url)),
				__filename: fileURLToPath(import.meta.url),
				buffer: await import('node:buffer'),
				client: this.container.client,
				command: this,
				container: this.container,
				crypto: await import('node:crypto'),
				discord: {
					...(await import('discord.js')),
					builders: await import('@discordjs/builders'),
					collection: await import('@discordjs/collection'),
					types: await import('discord-api-types/v10')
				},
				events: await import('node:events'),
				fetch: await import('@aero/http'),
				foxxie: {
					api: {
						lastfm: await import('#apis/last.fm/index')
					},
					audio: await import('#Foxxie/Audio'),
					database: {
						...(await import('#lib/database')),
						settings: await import('#lib/database/settings/index')
					},
					i18n: await import('#lib/i18n'),
					moderation: {
						...(await import('#lib/moderation')),
						actions: await import('#lib/moderation/actions'),
						common: await import('#lib/moderation/common'),
						managers: {
							...(await import('#lib/moderation/managers')),
							loggers: await import('#lib/moderation/managers/loggers')
						}
					},
					modules: {
						birthday: await import('#modules/birthday'),
						starboard: await import('#modules/starboard'),
						suggestions: await import('#modules/suggestions')
					},
					structures: {
						...(await import('#lib/structures')),
						managers: await import('#lib/structures/managers')
					},
					utils: {
						bits: await import('#utils/bits'),
						builders: await import('#utils/builders'),
						common: await import('#utils/common'),
						constants: await import('#utils/constants'),
						external: await import('#utils/external/index'),
						functions: await import('#utils/functions'),
						parsers: await import('#utils/parsers/index'),
						resolvers: await import('#utils/resolvers')
					}
				},
				fs: await import('node:fs'),
				http: await import('node:http'),
				module: await import('node:module'),
				os: await import('node:os'),
				path: await import('node:path'),
				process: await import('node:process'),
				require: createRequire(import.meta.url),
				sanitize: await import('@foxxiebot/sanitize'),
				sapphire: {
					asyncQueue: await import('@sapphire/async-queue'),
					framework: await import('@sapphire/framework'),
					pieces: await import('@sapphire/pieces'),
					snowflake: await import('@sapphire/snowflake'),
					stopwatch: await import('@sapphire/stopwatch'),
					utilities: {
						...(await import('@sapphire/utilities')),
						discord: await import('@sapphire/discord.js-utilities'),
						time: await import('@sapphire/time-utilities')
					}
				},
				stream: { web: await import('node:stream/web'), ...(await import('node:stream')) },
				timers: { promises: await import('node:timers/promises'), ...(await import('node:timers')) },
				url: await import('node:url'),
				util: await import('node:util'),
				v8: await import('node:v8'),
				vm: await import('node:vm'),
				worker_threads: await import('node:worker_threads')
			};
		}

		return this.#cachedEvalContext;
	}

	private formatTime(syncTime: string, asyncTime?: string) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}

	private async runEval(
		message: Message,
		args: FoxxieCommand.Args,
		code: string,
		signal: AbortSignal | null,
		timeout: number | undefined
	): Promise<EvalResult> {
		if (args.getFlags('async')) code = `(async () => {\n${code}\n})();`;

		let script: Script;
		try {
			script = new Script(code, { filename: 'eval' });
		} catch (error) {
			return { result: (error as SyntaxError).message, success: false, time: '💥 Syntax Error', type: new Type(error) };
		}

		const context = createContext({ ...(await this.fetchContext()), args, message, msg: message, signal });

		const stopwatch = new Stopwatch();
		let success: boolean;
		let syncTime = '';
		let asyncTime = '';
		let result: unknown;
		let thenable = false;
		let type: Type;
		let length!: number;

		try {
			result = script.runInNewContext(context, { microtaskMode: 'afterEvaluate', timeout });

			// If the signal aborted, it should not continue processing the result:
			if (signal?.aborted) return { result: 'AbortError', success: false, time: '⏱ ...', type: new Type(result) };

			syncTime = stopwatch.toString();
			type = new Type(result);
			if (isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
			if (Array.isArray(result)) length = result.length;
		} catch (error) {
			if (!syncTime.length) syncTime = stopwatch.toString();
			type = new Type(result);
			if (thenable && !asyncTime.length) asyncTime = stopwatch.toString();
			result = error;
			success = false;
		}

		// If the signal aborted, it should not continue processing the result:
		if (signal?.aborted) return { result: 'AbortError', success: false, time: '⏱ ...', type: new Type(result) };

		stopwatch.stop();
		if (typeof result !== 'string') {
			result =
				result instanceof Error
					? result.stack
					: args.getFlags('json')
						? JSON.stringify(result, null, 4)
						: inspect(result, {
								depth: Number(args.getOption('depth', 'd') ?? 0) || 0,
								showHidden: args.getFlags('showHidden', 'hidden')
							});
		}
		return {
			length,
			result: clean(result as string),
			success,
			time: this.formatTime(syncTime, asyncTime ?? ''),
			type
		};
	}

	private async sql(sql: string) {
		const stopwatch = new Stopwatch();
		let success: boolean;
		let time: string;
		let result: unknown;
		let type: Type;
		let length!: number;

		try {
			result = await this.container.prisma.$queryRawUnsafe(sql);
			time = stopwatch.toString();
			success = true;
			type = new Type(result);
			if (Array.isArray(result)) length = result.length;
		} catch (error) {
			time = stopwatch.toString();
			result = error;
			type = new Type(result);
			success = false;
		}

		stopwatch.stop();

		return {
			length,
			result: JSON.stringify(result, null, 2),
			success,
			time: this.formatTime(time),
			type
		};
	}
}

interface EvalResult {
	length?: number;
	result: string;
	success: boolean;
	time: string;
	type: Type;
}
