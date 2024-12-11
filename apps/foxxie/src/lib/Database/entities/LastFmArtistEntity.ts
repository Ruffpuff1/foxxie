import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity('lastfmartist', { schema: 'public' })
export class LastFmArtistEntity extends BaseEntity {
	@ObjectIdColumn()
	public _id!: string;

	public countryCode!: string;

	public disambiguation!: string;

	public endDate?: Date;

	public gender!: string;

	@Column()
	public lastFmDate!: Date;

	@Column('varchar', { default: null })
	public lastFmDescription!: string;

	@Column('varchar', { default: null })
	public lastFmUrl!: string;

	public location!: string;

	public mbid?: string;

	public musicBrainzDate?: Date;

	@PrimaryColumn({ default: null })
	public name!: string;

	public popularity?: number;

	public spotifyId!: string;

	public spotifyImageDate?: Date;

	@Column()
	public spotifyImageUrl!: string;

	public startDate?: Date;

	public tags: { name: string; url: string }[] = [];

	public type!: string;

	public constructor(data: Partial<LastFmArtistEntity>) {
		super();
		Object.assign(this, data);
	}
}
