import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ButtonInteraction } from 'discord.js';

export abstract class FoxxieButtonInteractionHandler extends InteractionHandler {
	private handler: FoxxieButtonInteractionHandler.Handler;
	private key: string;
	public constructor(context: InteractionHandler.LoaderContext, options: FoxxieButtonInteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button
		});

		this.handler = options.handler;
		this.key = options.key;
	}

	public override async parse(interaction: ButtonInteraction) {
		const splitId = interaction.customId.split('-');
		const [key, userId] = splitId.splice(0, 2);

		if (key !== this.key) {
			return this.none();
		}

		if (userId !== interaction.user.id) {
			return this.none();
		}

		const result = await this.handler(interaction, splitId);
		return isNullish(result) ? this.none() : this.some(result);
	}

	public abstract override run(interaction: ButtonInteraction, parsedData?: unknown): unknown;
}

export namespace FoxxieButtonInteractionHandler {
	export type HandleArgs = [interaction: ButtonInteraction, splitId: string[]];

	export type Handler = (interaction: ButtonInteraction, splitId: string[]) => any;

	export type Options = {
		handler: Handler;
		key: string;
	} & Omit<InteractionHandler.Options, 'interactionHandlerType'>;
	export type RunArgs<T> = [interaction: ButtonInteraction, result: T];
}
