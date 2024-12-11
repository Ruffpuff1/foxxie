import { HighlightTypeEnum } from '#lib/Container/Workers/types';
import { Column, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class Highlight<T extends HighlightTypeEnum = HighlightTypeEnum> {
	@ObjectIdColumn()
	public _id!: string;

	@PrimaryColumn('varchar', { length: 19 })
	public userId: string | null = null;

	@Column('varchar', { length: 50, default: () => 'null' })
	public word!: T extends HighlightTypeEnum.Regex ? RegExp : string;

	@Column('smallint', {
		default: HighlightTypeEnum.Word
	})
	public type: HighlightTypeEnum = HighlightTypeEnum.Word;

	public constructor(data: Partial<Highlight<HighlightTypeEnum>>) {
		Object.assign(this, data);
	}

	public toJSON() {
		return {
			userId: this.userId,
			word: this.word,
			type: this.type
		};
	}
}
