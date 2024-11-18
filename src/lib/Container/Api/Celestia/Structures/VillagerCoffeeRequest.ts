export class VillagerCoffeeRequest {
    public beans: string;

    public milk: string;

    public sugar: string;

    public constructor(data: Partial<VillagerCoffeeRequest>) {
        Object.assign(this, data);
    }
}
