import { UpdateTypeBitfield } from '../../enums/UpdateType.js';

export interface IndexedUserStats {
	albumCount?: number;

	artistCount?: number;

	failedUpdates?: UpdateTypeBitfield;

	importCount?: number;

	playCount?: number;

	totalCount?: number;

	trackCount?: number;

	updateError?: boolean;
}
