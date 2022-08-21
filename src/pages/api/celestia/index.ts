import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.json({
        list_all_villagers: 'https://celestia.apis.reese.cafe/villagers',
        get_a_villager: 'https://celestia.apis.reese.cafe/villagers/{key}',
        get_a_villagers_coffee: 'https://celestia.apis.reese.cafe/villagers/{key}/coffee'
    });
}
