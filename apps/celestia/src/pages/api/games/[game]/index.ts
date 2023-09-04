import { GamesEnum, RouteRequestPayloads } from '@foxxie/celestia-api-types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Games } from '../../../../assets/celestia/games';

export default function handler(req: NextApiRequest, res: NextApiResponse<RouteRequestPayloads['CelestiaGamesGame']>) {
    const game = Games.get(req.query.game as `${GamesEnum}`)!;

    if (!game) {
        res.json({ error: 'Game not found', code: 404 });
        return;
    }

    res.json(game);
}
