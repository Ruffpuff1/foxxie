import { RouteRequestPayloads, VillagerKey } from '@foxxie/celestia-api-types';
import { cast } from '@ruffpuff/utilities';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Villagers } from '../../../../assets/celestia';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RouteRequestPayloads['CelestiaVillagersVillagerArt']>
) {
    const villager = Villagers.get(cast<VillagerKey>(req.query.name))!;

    if (!villager) {
        res.json({ error: 'Villager not found', code: 404 });
        return;
    }

    const blob = await (await fetch(villager.art.villager)).blob();
    const arrBuffer = (await blob?.arrayBuffer())!;
    const buffer = Buffer.from(arrBuffer);

    res.status(200).setHeader('Content-Type', `${blob?.type}; charset=utf-8`).send(buffer);
}
