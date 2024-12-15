import { AllGames, RouteRequestPayloads } from '@foxxie/celestia-api-types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_: NextApiRequest, res: NextApiResponse<RouteRequestPayloads['CelestiaGames']>) {
    const games = AllGames;
    res.json({ games });
}
