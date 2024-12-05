import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('lastfmartist', { schema: 'public' })
export class LastFmArtistEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	@PrimaryColumn({ default: null })
	public name!: string;

	@Column('varchar', { default: null })
	public lastFmUrl!: string;

	@Column('varchar', { default: null })
	public lastFmDescription!: string;

	@Column()
	public lastFmDate!: Date;

	@Column()
	public spotifyImageUrl!: string;

	public spotifyImageDate?: Date;

	public spotifyId!: string;

	public popularity?: number;

	public mbid?: string;

	public musicBrainzDate?: Date;

	public location!: string;

	public countryCode!: string;

	public type!: string;

	public gender!: string;

	public disambiguation!: string;

	public startDate?: Date;

	public endDate?: Date;

	public tags: { name: string; url: string }[] = [];

	public constructor(data: Partial<LastFmArtistEntity>) {
		super();
		Object.assign(this, data);
	}
}
