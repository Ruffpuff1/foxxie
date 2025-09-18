import { FT, T } from '#lib/types';

export const Description = T('commands/general/ping:description');
export const Name = T('commands/general/ping:name');
export const Ping = T('commands/general/ping:ping');
export const Pong = FT<
	| {
			context: 'slash';
			dbPing: string;
	  }
	| {
			dbPing: string;
			roundTrip: number;
			wsPing: number;
	  }
>('commands/general/ping:pong');
