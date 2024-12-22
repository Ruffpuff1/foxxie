import { RouteRequestPayloads, VillagerKey } from '@foxxie/celestia-api-types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Villagers } from '../../../../assets/celestia';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<RouteRequestPayloads['CelestiaVillagersVillager']>
) {
    const villager = Villagers.get(req.query.name as `${VillagerKey}`)!;

    if (!villager) {
        res.json({ error: 'Villager not found', code: 404 });
        return;
    }

    res.json(villager);
}
