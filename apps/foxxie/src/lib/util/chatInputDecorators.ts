import { createMethodDecorator } from '@sapphire/decorators';
import { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { CustomGet } from '#lib/types';
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

export const commandsCache = new Map<string | symbol, ({ translate?: boolean } & ApplicationCommandOptionData)[]>();

export const AddAttachmentOption = (
	name: string,
	description: string,
	optionOptions?: ETranslatedOptionOptions<ApplicationCommandAttachmentOption>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandAttachmentOption = {
			description,
			name,
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
			description,
			name,
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
	optionOptions?: {
		translate?: boolean;
	} & Omit<ApplicationCommandAutocompleteStringOptionData, 'autocomplete' | 'description' | 'name' | 'type'>
): MethodDecorator => {
	return createMethodDecorator((_, propertyKey) => {
		const options: ApplicationCommandAutocompleteStringOptionData = {
			autocomplete: true,
			description,
			name,
			type: ApplicationCommandOptionType.String,
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
			description,
			name,
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
			description,
			name,
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
	...options: { description: string; name: string }[]
) => { description: string; name: string; type: ApplicationCommandOptionType.Subcommand }[] = (...options) =>
	options.map((opt) => ({
		description: opt.description,
		name: opt.name,
		type: ApplicationCommandOptionType.Subcommand
	}));

export const NameAndDescriptionToLocalizedSubCommands: (
	...options: (
		| { description: CustomGet<string, string>; name: CustomGet<string, string>; translate?: true }
		| { description: string; name: string; translate?: false }
	)[]
) => ApplicationCommandSubCommandData[] = (...options) => {
	const englishUS = getFixedT('en-US');
	const spanishMX = getFixedT('es-ES');

	return options.map((opt) => {
		if (!opt.translate) return { description: opt.description, name: opt.name, type: ApplicationCommandOptionType.Subcommand };

		return {
			description: englishUS(opt.description),
			descriptionLocalizations: {
				[Locale.SpanishES]: spanishMX(opt.description)
			},

			name: englishUS(opt.name),
			nameLocalizations: {
				[Locale.SpanishES]: spanishMX(opt.name)
			},
			type: ApplicationCommandOptionType.Subcommand
		} as ApplicationCommandSubCommandData;
	});
};

export const AddTranslatedStringOption = (
	nameKey: CustomGet<string, string>,
	descriptionKey: CustomGet<string, string>,
	options: TranslatedOptionOptions<ApplicationCommandAutocompleteStringOptionData | ApplicationCommandStringOptionData>
) => {
	if (options.autocomplete) return AddStringAutoCompleteOption(nameKey, descriptionKey, { ...options, translate: true });
	return AddStringOption(nameKey, descriptionKey, { ...options, autocomplete: false, translate: true });
};

export const AddTranslatedBooleanOption = (
	nameKey: CustomGet<string, string>,
	descriptionKey: CustomGet<string, string>,
	options: TranslatedOptionOptions<ApplicationCommandBooleanOption>
) => {
	return AddBooleanOption(nameKey, descriptionKey, { ...options, translate: true });
};

export type ETranslatedOptionOptions<T extends ApplicationCommandOption> = {
	commandName?: string;
	translate?: boolean;
} & Omit<T, 'description' | 'name' | 'type'>;

export interface TranslatedOptionChoice {
	key: CustomGet<string, string>;
	value: string;
}

export type TranslatedOptionOptions<T extends ApplicationCommandOption> = Omit<T, 'description' | 'name' | 'type'>;

export class T {
	public englishUS: TFunction;

	public spanishMX: TFunction;

	public constructor(englishUS: TFunction, spanishMX: TFunction) {
		this.englishUS = englishUS;

		this.spanishMX = spanishMX;
	}
}
