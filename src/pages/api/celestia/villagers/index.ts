import { Villagers } from '@assets/celestia';
import { VillagerEnum } from '@assets/celestia/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse<{ villagers: `${VillagerEnum}`[] }>) {
    const villagers = [...Villagers.keys()];
    res.json({ villagers });
}
