import { VillagerKey, VillagerKeyArray } from '@foxxie/celestia-api-types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse<{ villagers: `${VillagerKey}`[] }>) {
    res.json({ villagers: VillagerKeyArray });
}
