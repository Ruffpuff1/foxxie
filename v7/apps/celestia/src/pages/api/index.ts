import { ROUTES } from '@foxxie/celestia-api-types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
    res.json(ROUTES);
}
