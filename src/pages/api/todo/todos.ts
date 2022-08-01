import { database } from '@utils/firebase';
import { query, where, getDocs } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    const uid = req.query.uid as string;
    const list = req.query.list as string | undefined;
    const completed = req.query.completed as string | undefined;

    if (completed) {
        const parsedBool = completed === 'true';

        if (list) {
            const todosRef = query(database.todos, where('userId', '==', uid), where('list', '==', list));

            const todos = (await getDocs(todosRef)).docs.map(d => d.data());
            res.json({ todos: todos.filter(t => t.completed === parsedBool) });
            return;
        }

        const todosRef = query(database.todos, where('userId', '==', uid));

        const todos = (await getDocs(todosRef)).docs.map(d => d.data());
        res.json({ todos: todos.filter(d => d.completed === parsedBool) });
        return;
    }

    if (list) {
        const todosRef = query(database.todos, where('userId', '==', uid), where('list', '==', list));

        const todos = (await getDocs(todosRef)).docs.map(d => d.data());
        res.json({ todos });
        return;
    }

    const todosRef = query(database.todos, where('userId', '==', uid));

    const todos = (await getDocs(todosRef)).docs.map(d => d.data());
    res.json({ todos });
}
