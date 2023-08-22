import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.json({
        list_all_villagers: 'https://celestia.apis.rsehrk.com/villagers',
        get_a_villager: 'https://celestia.apis.rsehrk.com/villagers/{key}',
        get_a_villagers_coffee: 'https://celestia.apis.rsehrk.com/villagers/{key}/coffee'
    });
}
