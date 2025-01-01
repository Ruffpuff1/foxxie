import { RouteRequestPayloads, VillagerKey } from '@foxxie/celestia-api-types';
import { cast } from '@ruffpuff/utilities';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Villagers } from '../../../../assets/celestia';

export default function handler(req: NextApiRequest, res: NextApiResponse<RouteRequestPayloads['CelestiaVillagersVillagerCoffee']>) {
    const villager = Villagers.get(cast<VillagerKey>(req.query.name))!;

    if (!villager) {
        res.json({ error: 'Villager not found', code: 404 });
        return;
    }

    if (!villager.coffeeRequest) {
        res.json({ error: 'No coffee available', code: 404 });
        return;
    }

    res.json(villager.coffeeRequest);
}
