/**
 * @license Apache License 2.0
 * @copyright 2019 Skyra Project
 */
import { Piece, PieceOptions } from '@sapphire/framework';
import type { Awaitable } from '@sapphire/utilities';
import { PartialResponseValue, ScheduleEntry } from '../manager/ScheduleEntry';

export abstract class Task<T extends ScheduleEntry.TaskId = ScheduleEntry.TaskId> extends Piece {
	/**
	 * The run method to be overwritten in actual Task pieces
	 * @param data The data
	 */
	public abstract run(data: unknown): Awaitable<PartialResponseValue | null>;
}

export namespace Task {
	export type Options = PieceOptions;
}
