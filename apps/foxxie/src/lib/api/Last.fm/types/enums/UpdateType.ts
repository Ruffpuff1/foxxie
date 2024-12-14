import { BitField } from 'discord.js';

export const UpdateType = {
	Albums: 1 << 5,
	AllPlays: 1 << 2,
	Artist: 1 << 4,
	Discogs: 1 << 7,
	Full: 1 << 3,
	RecentPlays: 1 << 1,
	Tracks: 1 << 6
};

export type UpdateTypeFlags = `${keyof typeof UpdateType}`;

export class UpdateTypeBitfield extends BitField<UpdateTypeFlags> {
	public static override Flags = UpdateType;
}
