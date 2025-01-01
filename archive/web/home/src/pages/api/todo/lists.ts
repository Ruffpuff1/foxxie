import { database } from '@util/firebase';
import { getDocs, query, where } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    const uid = req.query.uid as string;
    const listsRef = query(database.todoLists, where('uid', '==', uid));

    const lists = (await getDocs(listsRef)).docs.map(d => d.data());
    res.json({ lists });
}
