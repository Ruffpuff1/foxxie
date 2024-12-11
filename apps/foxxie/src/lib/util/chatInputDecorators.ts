import { LanguageKeys } from '#lib/i18n';
import { CustomGet } from '#lib/types';
import { createMethodDecorator } from '@sapphire/decorators';
import { TFunction } from '@sapphire/plugin-i18next';
import {
	ApplicationCommandAttachmentOption,
	ApplicationCommandAutocompleteStringOptionData,
	ApplicationCommandBooleanOption,
	ApplicationCommandOption,
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionData,
	ApplicationCommandOptionType,
	ApplicationCommandStringOptionData,
	ApplicationCommandSubCommandData,
	ApplicationCommandUserOption,
	Locale
} from 'discord.js';
import { getFixedT } from 'i18next';

export const commandsCache = new Map<string | symbol, (ApplicationCommandOptionData & { translate?: boolean })[]>();

export const AddAttachmentOption = (
	name: string,
	description: string,
	optionOptions?: ETranslatedOptionOptions<ApplicationCommandAttachmentOption>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandAttachmentOption = {
			name,
			description,
			type: ApplicationCommandOptionType.Attachment,
			...optionOptions
		};

		if (propertyKey.toString() === 'chatInputRun') {
			const key = `${optionOptions?.commandName}.chatinputrun`;
			const previous = commandsCache.get(key);

			if (previous) previous.push(options);
			else commandsCache.set(key, [options]);
			return;
		}

		const key = propertyKey.toString().toLowerCase();
		const previous = commandsCache.get(key);

		if (previous) previous.push(options);
		else commandsCache.set(key, [options]);
	});
};

export const AddStringOption = (
	name: string,
	description: string,
	optionOptions?: ETranslatedOptionOptions<ApplicationCommandStringOptionData>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandStringOptionData = {
			name,
			description,
			type: ApplicationCommandOptionType.String,
			...optionOptions
		};

		if (propertyKey.toString() === 'chatInputRun') {
			const key = `${optionOptions?.commandName}.chatinputrun`;
			const previous = commandsCache.get(key);

			if (previous) previous.push(options);
			else commandsCache.set(key, [options]);
			return;
		}

		const key = propertyKey.toString().toLowerCase();
		const previous = commandsCache.get(key);

		if (previous) previous.push(options);
		else commandsCache.set(key, [options]);
	});
};

export const AddStringAutoCompleteOption = (
	name: string,
	description: string,
	optionOptions?: Omit<ApplicationCommandAutocompleteStringOptionData, 'name' | 'description' | 'type' | 'autocomplete'> & {
		translate?: boolean;
	}
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandAutocompleteStringOptionData = {
			name,
			description,
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			...optionOptions
		};

		const key = propertyKey.toString().toLowerCase();
		const previous = commandsCache.get(key);

		if (previous) previous.push(options);
		else commandsCache.set(key, [options]);
	});
};

export const AddBooleanOption = (
	name: string,
	description: string,
	optionOptions: ETranslatedOptionOptions<ApplicationCommandBooleanOption>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandBooleanOption = {
			name,
			description,
			type: ApplicationCommandOptionType.Boolean,
			...optionOptions
		};

		const key = propertyKey.toString().toLowerCase();
		const previous = commandsCache.get(key);

		if (previous) previous.push(options);
		else commandsCache.set(key, [options]);
	});
};

export const AddUserOption = (
	name: string,
	description: string,
	optionOptions: TranslatedOptionOptions<ApplicationCommandUserOption>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandUserOption = {
			name,
			description,
			type: ApplicationCommandOptionType.User,
			...optionOptions
		};

		const key = propertyKey.toString().toLowerCase();
		const previous = commandsCache.get(key);

		if (previous) previous.push(options);
		else commandsCache.set(key, [options]);
	});
};

export const AddEphemeralOption = () =>
	AddTranslatedBooleanOption(LanguageKeys.Globals.ChatInputOptionHidden, LanguageKeys.Globals.ChatInputOptionHiddenDescription, {
		required: false
	});

export const MapStringOptionsToChoices: (...choices: string[]) => ApplicationCommandOptionChoiceData<string>[] = (...choices) =>
	choices.map((opt) => ({ name: opt, value: opt }));

export const NameAndDescriptionsToSubcommands: (
	...options: { name: string; description: string }[]
) => { name: string; description: string; type: ApplicationCommandOptionType.Subcommand }[] = (...options) =>
	options.map((opt) => ({
		name: opt.name,
		description: opt.description,
		type: ApplicationCommandOptionType.Subcommand
	}));

export const NameAndDescriptionToLocalizedSubCommands: (
	...options: (
		| { name: CustomGet<string, string>; description: CustomGet<string, string>; translate?: true }
		| { name: string; description: string; translate?: false }
	)[]
) => ApplicationCommandSubCommandData[] = (...options) => {
	const englishUS = getFixedT('en-US');
	const spanishMX = getFixedT('es-ES');

	return options.map((opt) => {
		if (!opt.translate) return { name: opt.name, description: opt.description, type: ApplicationCommandOptionType.Subcommand };

		return {
			name: englishUS(opt.name),
			description: englishUS(opt.description),

			type: ApplicationCommandOptionType.Subcommand,
			nameLocalizations: {
				[Locale.SpanishES]: spanishMX(opt.name)
			},
			descriptionLocalizations: {
				[Locale.SpanishES]: spanishMX(opt.description)
			}
		} as ApplicationCommandSubCommandData;
	});
};

export const AddTranslatedStringOption = (
	nameKey: CustomGet<string, string>,
	descriptionKey: CustomGet<string, string>,
	options: TranslatedOptionOptions<ApplicationCommandStringOptionData | ApplicationCommandAutocompleteStringOptionData>
) => {
	if (options.autocomplete) return AddStringAutoCompleteOption(nameKey, descriptionKey, { ...options, translate: true });
	return AddStringOption(nameKey, descriptionKey, { ...options, translate: true, autocomplete: false });
};

export const AddTranslatedBooleanOption = (
	nameKey: CustomGet<string, string>,
	descriptionKey: CustomGet<string, string>,
	options: TranslatedOptionOptions<ApplicationCommandBooleanOption>
) => {
	return AddBooleanOption(nameKey, descriptionKey, { ...options, translate: true });
};

export interface TranslatedOptionChoice {
	key: CustomGet<string, string>;
	value: string;
}

export class T {
	public englishUS: TFunction;

	public spanishMX: TFunction;

	public constructor(englishUS: TFunction, spanishMX: TFunction) {
		this.englishUS = englishUS;

		this.spanishMX = spanishMX;
	}
}

export type TranslatedOptionOptions<T extends ApplicationCommandOption> = Omit<T, 'name' | 'description' | 'type'>;

export type ETranslatedOptionOptions<T extends ApplicationCommandOption> = Omit<T, 'name' | 'description' | 'type'> & {
	translate?: boolean;
	commandName?: string;
};
