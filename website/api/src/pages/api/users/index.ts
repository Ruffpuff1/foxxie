import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            {
                await prisma.$connect();

                const users = await prisma.user.findMany();
                res.json({ users });

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
