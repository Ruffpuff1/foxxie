import { Ban, PrismaClient } from '@prisma/client';
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
        case 'POST': {
            const { id } = req.query;
            const { reason, provider, moderatorId, createdAt, userId } = JSON.parse(req.body || {});

            console.log(!req.body.reason);

            if (!reason && !moderatorId && !createdAt && !userId) {
                res.json({
                    error: 'Invalid Ban',
                    code: 30003,
                    message: 'The ban object provided is missing one or more fields.'
                });

                await prisma.$disconnect();
                return;
            }

            const postObj: Omit<Ban, 'id'> = { provider: provider ?? 'Foxxie', reason, moderatorId, createdAt, userId };

            await prisma.$connect();

            await prisma.ban.create({
                data: postObj
            });

            let user = await prisma.user.findFirst({
                where: {
                    userId: id as string
                },
                include: {
                    bans: true
                }
            });

            // eslint-disable-next-line no-negated-condition
            if (!user) {
                user = {
                    ...(await prisma.user.create({
                        data: {
                            userId: id as string,
                            attributes: {
                                github: null,
                                twitter: null,
                                color: null,
                                location: null,
                                email: null,
                            }
                        }
                    })),
                    bans: [postObj as Ban]
                };
            }
            const bans = user.bans.map(({ reason, provider, moderatorId, createdAt, userId }) => ({
                provider,
                reason,
                moderatorId,
                createdAt,
                userId
            }));

            res.json({ bans });

            await prisma.$disconnect();
            break;
        }
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
