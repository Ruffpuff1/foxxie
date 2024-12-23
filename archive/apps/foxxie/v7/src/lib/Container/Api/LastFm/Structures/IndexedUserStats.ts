import { UpdateTypeBitField } from '../Enums/UpdateType';

export class IndexedUserStats {
    public artistCount?: number;

    public albumCount?: number;

    public trackCount?: number;

    public playCount?: number;

    public importCount?: number;

    public totalCount?: number;

    public updateError?: boolean;

    public failedUpdates: UpdateTypeBitField;

    public constructor(data?: Partial<IndexedUserStats>) {
        Object.assign(this, data);
    }
}
