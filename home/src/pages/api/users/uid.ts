import { database } from '@util/firebase';
import { getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    const email = req.query.email as string;
    const userRef = query(database.users, where('google.email', '==', email));

    const userId = (await getDocs(userRef))?.docs[0]?.data().userId;
    if (!userId) {
        res.json({
            code: 404,
            message: 'User not found'
        });
        return;
    }

    res.json({ uid: userId });
}
