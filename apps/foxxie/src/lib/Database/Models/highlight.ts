import { HighlightTypeEnum } from '#lib/Container/Workers/types';

export interface HighlightData {
	guildId: string;

	type: HighlightTypeEnum;

	userId: string;

	word: RegExp | string;
}

export class Highlight<T extends HighlightTypeEnum = HighlightTypeEnum> {
	public guildId: string = null!;

	public type: HighlightTypeEnum = HighlightTypeEnum.Word;

	public userId: string = null!;

	public word!: T extends HighlightTypeEnum.Regex ? RegExp : string;

	public constructor(data?: Partial<Highlight>) {
		Object.assign(this, data);
	}
}
