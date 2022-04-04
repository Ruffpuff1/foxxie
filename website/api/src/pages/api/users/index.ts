import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            {
                await prisma.$connect();

                const users = await prisma.user.findMany();
                const returnVal = users.map(({ userId, pronouns, whitelisted }) => ({ userId, pronouns, whitelisted }));

                res.json({ users: returnVal });

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
