import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            {
                const { id } = req.query;

                await prisma.$connect();

                const user = await prisma.user.findFirst({
                    where: {
                        userId: id as string
                    },
                    include: {
                        bans: true
                    }
                });

                // eslint-disable-next-line no-negated-condition
                if (!user) {
                    res.json({
                        error: 'User not found',
                        code: 10001
                    });
                } else {
                    const bans = user.bans.map(({ reason, provider, moderatorId, createdAt, userId }) => ({
                        provider,
                        reason,
                        moderatorId,
                        createdAt,
                        userId
                    }));

                    res.json({ bans });
                }

                await prisma.$disconnect();
            }
            break;
        default:
            {
                res.json({
                    error: 'Method Not Allowed',
                    code: 405
                });
            }
            break;
    }
}
