import { resolveToNull, ZeroWidthSpace } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { isNullish, Nullish } from '@sapphire/utilities';
import { BrandingColors } from '#utils/constants';
import { ifNotNull } from '#utils/util';
import { APIEmbedField, ChatInputCommandInteraction, ColorResolvable, EmbedFooterOptions, GuildResolvable, Message } from 'discord.js';

/**
 * Returns a conditional embed field.
 */
export function conditionalField(
	condition: boolean,
	name: string,
	text: (Nullish | string)[] | Nullish | string | string[],
	inline: boolean = false
) {
	if (!text) return null;
	return ifNotNull(condition, resolveField(name, text, inline));
}

export function conditionalFooter(condition: boolean, text: string, iconURL?: Nullish | string): EmbedFooterOptions | null {
	return ifNotNull(condition, resolveFooter(text, iconURL));
}

export function orField(condition: boolean, onTrue: APIEmbedField, onFalse: APIEmbedField) {
	return condition ? onTrue : onFalse;
}

export function removeEmptyFields(fields: (APIEmbedField | Nullish)[]): APIEmbedField[] {
	return fields.filter((field) => !isNullish(field));
}
export async function resolveClientColor(
	resolveable: ChatInputCommandInteraction | GuildResolvable | Message | null,
	color?: ColorResolvable | number
): Promise<ColorResolvable> {
	if (color) return color;
	if (!resolveable) return BrandingColors.Primary;

	if (resolveable instanceof Message) {
		if (resolveable.inGuild()) {
			const { member } = resolveable;
			if (member) {
				const memberColor = member.roles.highest.color;
				if (memberColor) return memberColor;
			} else {
				const { maybeMe } = container.utilities.guild(resolveable.guild);
				if (!maybeMe) return BrandingColors.Primary;

				return maybeMe.displayColor;
			}
		} else {
			return BrandingColors.Primary;
		}
	} else if (resolveable instanceof ChatInputCommandInteraction) {
		if (resolveable.inGuild()) {
			const fetchedMember = await resolveToNull(resolveable.guild!.members.fetch(resolveable.user.id!));
			if (fetchedMember) {
				const memberColor = fetchedMember.roles.highest.color;
				if (memberColor) return memberColor;
			} else {
				const { maybeMe } = container.utilities.guild(resolveable.guild!);
				if (!maybeMe) return color || BrandingColors.Primary;

				return maybeMe.displayColor;
			}
		}
	}
	const { maybeMe } = container.utilities.guild(
		resolveable instanceof Message || resolveable instanceof ChatInputCommandInteraction ? resolveable.guild! : resolveable
	);
	if (!maybeMe) return color || BrandingColors.Primary;

	return maybeMe.displayColor;
}
export function resolveDescription(text: string): string;
export function resolveDescription(text: (Nullish | string)[], joiner?: string): string;
export function resolveDescription(text: (Nullish | string)[] | string, joiner = '\n'): string {
	if (typeof text === 'string') return text;
	return text.filter((a) => !isNullish(a)).join(joiner);
}

export function resolveField(name: string, text: (Nullish | string)[] | Nullish | string, inline: boolean = false): APIEmbedField {
	if (isNullish(text)) return { inline, name, value: ZeroWidthSpace };
	return { inline, name, value: Array.isArray(text) ? text.filter((a) => !isNullish(a)).join('\n') : text };
}
export function resolveFooter(text: Nullish): null;
export function resolveFooter(text: string, iconURL?: Nullish | string): EmbedFooterOptions;

export function resolveFooter(text: any, iconURL?: Nullish | string): EmbedFooterOptions | null {
	if (isNullish(text)) return null;

	return {
		iconURL: iconURL || undefined,
		text
	};
}
