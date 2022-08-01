import React, { createContext, ReactNode, useEffect, useMemo, useReducer, useState } from 'react';
import { where, onSnapshot, query, Timestamp } from 'firebase/firestore';
import { database } from '@utils/firebase';
import { useAuth } from './useAuth';
import { useRouter } from 'next/router';

const defaultList = { id: '', userId: null, name: 'tasks', sortBy: 'my-order' };

function reducer(state: Payload, { type, payload }: { type: Actions; payload: Payload }) {
    switch (type) {
        case Actions.SetTasks:
            return {
                ...state,
                tasks: payload.tasks
            };
        case Actions.SetLists:
            return {
                ...state,
                lists: [defaultList, ...(payload.lists || [])]
            };
        default: {
            return state;
        }
    }
}

const enum Actions {
    SetTasks = 'setTasks',
    SetLists = 'setLists'
}

interface Payload {
    tasks?: TodoTask[];
    lists?: TodoList[];
}

export interface TodoTask {
    completeBy: Timestamp | null;
    completed: boolean;
    createdAt: Timestamp;
    list: 'tasks' | string;
    subtasks: string[];
    text: string;
    userId: string;
    details: string | null;
    id: string;
}

export interface TodoList {
    id: string;
    userId: string | null;
    sortBy: string;
    name: string;
}

export function useTodo(): [TodoTask[], TodoList[]] {
    const [user] = useAuth();

    const id = user?.uid || null;

    const [tasks, dispatch] = useReducer(reducer, {
        tasks: [],
        lists: [{ id: '', userId: id, name: 'tasks', sortBy: 'my-order' }]
    });

    useEffect(() => {
        const q = query(database.todos, where('userId', '==', id));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetTasks,
                    payload: {
                        tasks: snapshot.docs.map(database.todo)
                    }
                });
            }
        });
    }, [id]);

    useEffect(() => {
        const q = query(database.todoLists, where('userId', '==', id));

        return onSnapshot(q, {
            next: snapshot => {
                dispatch({
                    type: Actions.SetLists,
                    payload: {
                        lists: snapshot.docs.map(database.list)
                    }
                });
            }
        });
    }, [id]);

    return [tasks.tasks || [], tasks.lists || []];
}

export const SidebarContext = createContext({
    showTodo: false,
    setShowTodo: (b: boolean) => {
        /* */
    }
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [showTodo, setShowTodo] = useState(false);

    useEffect(() => {
        if (router.query.panel === 'todo') setShowTodo(true);
    }, [router.query.panel, setShowTodo]);

    const ctx = useMemo(() => ({ showTodo, setShowTodo }), [showTodo, setShowTodo]);

    return <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>;
}
