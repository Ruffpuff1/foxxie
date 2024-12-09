import { HighlightTypeEnum } from '#lib/Container/Workers/types';

export class Highlight<T extends HighlightTypeEnum = HighlightTypeEnum> {
	public userId: string = null!;

	public guildId: string = null!;

	public word!: T extends HighlightTypeEnum.Regex ? RegExp : string;

	public type: HighlightTypeEnum = HighlightTypeEnum.Word;

	public constructor(data?: Partial<Highlight>) {
		Object.assign(this, data);
	}
}

export interface HighlightData {
	userId: string;

	guildId: string;

	word: RegExp | string;

	type: HighlightTypeEnum;
}
