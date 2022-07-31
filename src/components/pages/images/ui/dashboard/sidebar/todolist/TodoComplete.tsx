/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { database } from '@utils/firebase';
import { deleteDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { MdCheck, MdDeleteOutline } from 'react-icons/md';
import { TodoTask } from 'src/hooks/useTodo';
import { useState } from 'react';

export default function TodoComplete({ todo }: { todo: TodoTask }) {
    const [showTrash, setShowTrash] = useState(false);

    const unCompleteTask = async () => {
        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    completed: false
                });
            }
        });
    };

    const deleteTask = () => {
        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId), where('completed', '==', true));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await deleteDoc(existingFile.ref);
            }
        });
    };

    return (
        <li
            className='bg-white py-2 px-3 duration-200 hover:bg-gray-200'
            onMouseEnter={() => {
                setShowTrash(true);
            }}
            onMouseLeave={() => {
                setShowTrash(false);
            }}
        >
            <div className='flex h-auto items-start justify-start space-x-4'>
                <button aria-label='Mark as not complete' onClick={() => unCompleteTask()}>
                    <h2 className='text-xl text-blue-500'>
                        <MdCheck />
                    </h2>
                </button>
                <div className='flex w-[250px] flex-col space-y-1 overflow-x-hidden text-ellipsis whitespace-nowrap'>
                    <h2 className='flex-wrap text-sm font-[400] line-through'>{todo.text}</h2>
                </div>
                <button aria-label='Delete task' onClick={() => deleteTask()} className={`pr-2 ${showTrash ? '' : 'opacity-0'}`}>
                    <MdDeleteOutline className='text-xl' />
                </button>
            </div>
        </li>
    );
}
