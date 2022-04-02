import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import type { OType } from '@ruffpuff/ts';

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
                    res.json({ ...user });
                }

                await prisma.$disconnect();
            }
            break;
        case 'POST': {
            const { id } = req.query;
            const { pronouns } = req.body || {};

            await prisma.$connect();

            const user = await prisma.user.findFirst({
                where: {
                    userId: id as string
                }
            });

            if (user) {
                res.json({
                    error: 'User already exists',
                    code: 20001
                });
            }

            type BodyType = OType<{ userId: string; pronouns?: number }>;
            const data: BodyType = { userId: id as string };

            if (pronouns) {
                const validPronuns = Array.from(Array(17).keys());
                if (!validPronuns.includes(pronouns)) {
                    res.json({
                        error: 'Invalid pronouns',
                        code: 30001,
                        recieved: pronouns
                    });

                    await prisma.$disconnect();
                    return;
                }

                data.pronouns = pronouns as number;
            }

            const created = await prisma.user.create({
                data
            });

            res.json({ ...created });

            await prisma.$disconnect();
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

/*
none 0
he/him 1
he/her 2
he/it 3
he/they 4
they/them 5
they/he 6
they/she 7
they/it 8
she/her 9
she/him 10
she/it 11
she/they 12
it/its 13
it/him 14
it/her 15
it/them 16
*/
