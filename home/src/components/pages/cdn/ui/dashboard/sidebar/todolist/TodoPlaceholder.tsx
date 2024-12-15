import { useAuth } from '@hooks/useAuth';
import { useClickOutside } from '@reeseharlak/usehooks';
import { database } from '@util/firebase';
import { addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';

export default function TodoPlaceholder(props: { placeholder: string; setPlaceholder: (p: string) => void; list: string }) {
    const [name, setName] = useState('');
    const [editText, setEditText] = useState(true);

    const [user] = useAuth();

    useClickOutside(
        () => {
            setEditText(false);
            props.setPlaceholder('');
            return name === '' ? undefined : addTodo();
        },
        'todo-placeholder',
        [editText]
    );

    const formatDate = (d: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(d);
    };

    const addTodo = () => {
        const ts = Timestamp.fromDate(new Date());

        return addDoc(database.todos, {
            completeBy: null,
            completed: false,
            createdAt: ts,
            list: props.list,
            subtasks: [],
            text: name,
            userId: user?.uid
        });
    };

    return (
        <li className={`overflow-y-hidden px-3 duration-200 hover:bg-gray-200 ${props.placeholder ? ' py-1' : ''}`}>
            <div className={`flex items-start justify-start space-x-4 duration-200 ${props.placeholder ? 'h-[55px]' : 'h-0'}`}>
                <input className='mt-1 h-4 w-4 rounded-full' type='checkbox' />
                <div className='flex w-full flex-col space-y-1'>
                    <button
                        className={`cursor-pointer flex-wrap text-sm font-normal ${editText ? 'hidden' : ''}`}
                        onClick={() => {
                            setEditText(true);
                        }}
                    >
                        {name}
                    </button>
                    <input
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        id='todo-placeholder'
                        placeholder='Title'
                        className={`flex-wrap text-sm font-normal ${editText ? '' : 'hidden'}`}
                        type='text'
                    />
                </div>
            </div>
        </li>
    );
}
