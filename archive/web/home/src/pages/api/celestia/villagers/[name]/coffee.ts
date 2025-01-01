import { Villagers } from '@assets/celestia';
import { Coffee, VillagerEnum } from '@assets/celestia/types';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Error {
    error: string;
    code: 404;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Coffee | Error>) {
    const villager = Villagers.get(req.query.name as `${VillagerEnum}`)!;

    if (!villager) {
        res.json({ error: 'Villager not found', code: 404 });
        return;
    }

    if (!villager.coffeeRequest) {
        res.json({ error: 'No coffee available', code: 404 });
        return;
    }

    res.json({ ...villager.coffeeRequest });
}
