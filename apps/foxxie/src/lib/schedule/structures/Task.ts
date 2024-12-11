import type { Awaitable } from '@sapphire/utilities';

import { Piece, PieceOptions } from '@sapphire/framework';
/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */
import { PartialResponseValue, ScheduleEntry } from '#lib/schedule';

export abstract class Task<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> extends Piece {
	/**
	 * The run method to be overwritten in actual Task pieces
	 * @param data The data
	 */
	public abstract run(data: unknown): Awaitable<null | PartialResponseValue>;
}

export namespace Task {
	export type Options = PieceOptions;
}
