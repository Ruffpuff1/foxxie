import { database } from '@utils/firebase';
import { query, where, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    const uid = req.query.uid as string;

    console.log(req.query.uid);

    const listsRef = query(database.todoLists, where('uid', '==', uid));

    const lists = (await getDocs(listsRef)).docs.map(d => d.data());
    res.json({ lists });
}
