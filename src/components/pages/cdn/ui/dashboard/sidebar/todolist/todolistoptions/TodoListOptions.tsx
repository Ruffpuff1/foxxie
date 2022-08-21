import { useAuth } from '@hooks/useAuth';
import { TodoList, TodoTask } from '@hooks/useTodo';
import { useClickOutside } from '@reeseharlak/usehooks';
import { database } from '@util/firebase';
import { deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { MdCheck, MdMoreVert } from 'react-icons/md';

export default function TodoListOptions({ list, setTaskList, lists, listTodos, setSortBy, sortBy }: Props) {
    const [showListOptions, setShowListOptions] = useState(false);
    useClickOutside(
        () => {
            setShowListOptions(false);
        },
        'todo-tasklist-options',
        [showListOptions]
    );

    const [user] = useAuth();

    const updateSortBy = async (k: string) => {
        setShowListOptions(false);
        setSortBy(k);

        if (list === 'tasks') {
            localStorage.setItem('default-tasks-list-sort-by', k);
            return;
        }

        const q = query(database.todoLists, where('name', '==', list), where('userId', '==', user?.uid || null));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    sortBy: k
                });
            }
        });
    };

    const deleteList = async () => {
        setShowListOptions(false);
        setTaskList('tasks');

        const listQ = query(database.todoLists, where('name', '==', list), where('userId', '==', user?.uid || null));
        const tasksQ = query(database.todos, where('list', '==', list), where('userId', '==', user?.uid || null));

        await getDocs(listQ).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await deleteDoc(existingFile.ref);
            }
        });

        await getDocs(tasksQ).then(async existingFiles => {
            return Promise.all(existingFiles.docs.map(d => deleteDoc(d.ref)));
        });
    };

    return (
        <div id='todo-tasklist-options'>
            <button
                aria-label='View list options'
                onClick={() => {
                    setShowListOptions(!showListOptions);
                }}
                className={`flex items-center justify-start space-x-3 rounded-full py-2 px-2 text-xl duration-200 ${
                    showListOptions ? 'bg-gray-200' : 'hover:bg-gray-200'
                }`}
            >
                <MdMoreVert />
            </button>

            <div
                className={`fixed top-28 right-4 h-72 origin-top-right rounded-lg border bg-white py-3 text-[#222] shadow-xl duration-200 ${
                    showListOptions ? 'w-64 scale-100' : 'w-0 scale-0'
                }`}
            >
                <h2 className='px-4 text-sm'>Sort by</h2>

                <ul className='whitespace-nowrap border-b-2 py-2 text-sm'>
                    <li>
                        <button
                            onClick={() => updateSortBy('my-order')}
                            className='flex h-[32px] w-full items-center justify-start space-x-2 py-1 pl-9 leading-[32px] hover:bg-gray-200'
                        >
                            <MdCheck className={`text-2xl duration-200 ${sortBy === 'my-order' ? 'opacity-100' : 'opacity-0'}`} />
                            <span className={sortBy === 'my-order' ? '' : 'ml-8'}>My order</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => updateSortBy('date')}
                            className='flex h-[32px] w-full items-center justify-start space-x-2 py-1 pl-9 leading-[32px] hover:bg-gray-200'
                        >
                            <MdCheck className={`text-2xl duration-200 ${sortBy === 'date' ? 'opacity-100' : 'opacity-0'}`} />
                            <span className={sortBy === 'date' ? '' : 'ml-8'}>Date</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => updateSortBy('starred-recently')}
                            className='flex h-[32px] w-full items-center justify-start space-x-2 py-1 pl-9 leading-[32px] hover:bg-gray-200'
                        >
                            <MdCheck className={`text-2xl duration-200 ${sortBy === 'starred-recently' ? 'opacity-100' : 'opacity-0'}`} />
                            <span className={sortBy === 'starred-recently' ? '' : 'ml-8'}>Starred recently</span>
                        </button>
                    </li>
                </ul>

                <ul className='whitespace-nowrap border-b-2 py-2 text-sm'>
                    <li>
                        <button
                            onClick={() => deleteList()}
                            className='flex h-[32px] w-full items-center justify-start space-x-2 py-1 pl-5 text-[.9rem] leading-[32px] hover:bg-gray-200'
                        >
                            Delete list
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

interface Props {
    list: string;
    lists: TodoList[];
    listTodos: TodoTask[];
    setTaskList: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
    setList: (l: string) => void;
}
