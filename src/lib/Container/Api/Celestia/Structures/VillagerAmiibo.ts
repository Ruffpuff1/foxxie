export class VillagerAmiibo {
    public series: string;

    public cardNumber: number;

    public constructor(data: Partial<VillagerAmiibo>) {
        Object.assign(this, data);
    }
}
