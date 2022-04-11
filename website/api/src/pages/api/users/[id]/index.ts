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
                    const returnObj = {
                        userId: user.userId,
                        pronouns: user.pronouns,
                        whitelisted: user.whitelisted,
                        bans: user.bans,
                        attributes: user.attributes
                    };

                    res.json({ ...returnObj });
                }

                await prisma.$disconnect();
            }
            break;
        case 'POST': {
            const { id } = req.query;
            const { pronouns, attributes } = req.body || {};

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

                await prisma.$disconnect();
                return;
            }

            type AttributeType = OType<{ color?: number; email?: string; github?: string; twitter?: string; location?: string }>;
            type BodyType = OType<{ userId: string; pronouns?: number; attributes: AttributeType }>;
            const data: BodyType = { userId: id as string, attributes: {} };

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

            if (attributes) {
                if (attributes.email) data.attributes.email = attributes.email;
                if (attributes.github) data.attributes.github = attributes.github;
                if (attributes.location) data.attributes.location = attributes.location;
                if (attributes.twitter) data.attributes.twitter = attributes.twitter;

                if (attributes.color && !isNaN(parseInt(attributes.color))) data.attributes.color = parseInt(attributes.color);
            }

            const created = await prisma.user.create({
                data
            });

            const returnObj = {
                userId: created.userId,
                pronouns: created.pronouns,
                whitelisted: created.whitelisted,
                attributes: created.attributes
            };

            res.json({ ...returnObj });

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
