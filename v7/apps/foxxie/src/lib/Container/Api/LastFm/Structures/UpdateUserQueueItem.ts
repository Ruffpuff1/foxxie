export class UpdateUserQueueItem {
    public constructor(
        public userId: string,
        public updateQueue = false,
        public getAccurateTotalPlaycount = true
    ) {}
}
