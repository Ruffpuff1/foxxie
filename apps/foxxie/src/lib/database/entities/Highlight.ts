import { HighlightTypeEnum } from '#lib/Container/Workers/types';
import { Column, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class Highlight<T extends HighlightTypeEnum = HighlightTypeEnum> {
	@ObjectIdColumn()
	public _id!: string;

	@Column('smallint', {
		default: HighlightTypeEnum.Word
	})
	public type: HighlightTypeEnum = HighlightTypeEnum.Word;

	@PrimaryColumn('varchar', { length: 19 })
	public userId: null | string = null;

	@Column('varchar', { default: () => 'null', length: 50 })
	public word!: T extends HighlightTypeEnum.Regex ? RegExp : string;

	public constructor(data: Partial<Highlight<HighlightTypeEnum>>) {
		Object.assign(this, data);
	}

	public toJSON() {
		return {
			type: this.type,
			userId: this.userId,
			word: this.word
		};
	}
}
