import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaitable } from '@sapphire/utilities';

export abstract class Task extends Piece {

    public abstract run(data: unknown): Awaitable<unknown | null>;

}

export namespace Task {
	export type Options = PieceOptions;
}