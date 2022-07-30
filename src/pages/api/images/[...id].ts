import { database } from '@utils/firebase';
import { query, where, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    const id = (req.query.id as string[]).pop()!;
    const folderName = (req.query.id as string[]).pop()!;

    const split = id.split('.');
    const [name, format] = split;

    const refrence = query(database.files, where('name', '==', `${name}.${format}`));

    const folderRef = query(database.folders, where('name', '==', `${folderName}`));

    const folders = (await getDocs(folderRef)).docs.map(d => d);
    const set = new Set(folders.map(f => f.id));

    const files = (await getDocs(refrence)).docs.map(d => d.data());
    const file = files.find(f => set.has(f.folderId));

    if (!file) {
        res.redirect('/404');
        return;
    }

    const blob = await (await fetch(file.url)).blob();
    const arrBuffer = (await blob?.arrayBuffer())!;
    const buffer = Buffer.from(arrBuffer);

    res.status(200).setHeader('Content-Type', `${blob?.type}; charset=utf-8`).send(buffer);
}
