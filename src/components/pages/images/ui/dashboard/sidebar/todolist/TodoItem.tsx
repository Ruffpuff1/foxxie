import { useClickOutside } from '@ruffpuff/usehooks';
import { database } from '@utils/firebase';
import { getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TodoTask } from '@hooks/useTodo';
import TodoDatePicker from './TodoDatePicker';

export default function TodoItem({ todo }: { todo: TodoTask }) {
    const [editText, setEditText] = useState(false);
    const [name, setName] = useState('');
    const [complete, setComplete] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const router = useRouter();

    const [inputRef] = useClickOutside<HTMLInputElement>(() => {
        setEditText(false);
        return name === '' ? undefined : updateName();
    }, [editText]);

    const date = todo.completeBy.toDate();

    const formatDate = (d: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(d);
    };

    const updateName = async () => {
        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        return getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    text: name
                });

                setName('');
            }
        });
    };

    const updateText = (v: string) => {
        setName(v);
    };

    const completeTask = async () => {
        setComplete(true);

        const q = query(database.todos, where('text', '==', todo.text), where('userId', '==', todo.userId));

        await getDocs(q).then(async existingFiles => {
            const existingFile = existingFiles.docs[0];

            if (existingFile) {
                await updateDoc(existingFile.ref, {
                    completed: true
                });
            }
        });

        setHidden(true);
    };

    return (
        <li key={todo.id} className='py-1 px-3 duration-200 hover:bg-gray-200'>
            <div className={`flex h-auto items-start justify-start space-x-4 duration-200 ${hidden ? 'h-0' : 'h-[200px]'}`}>
                <input className='mt-1 h-4 w-4 rounded-full' onChange={() => completeTask()} type='checkbox' />
                <div className='flex w-full flex-col items-start justify-start space-y-1'>
                    <button
                        className={`cursor-pointer flex-wrap text-sm font-[400] ${editText ? 'hidden' : ''} ${complete ? 'line-through' : ''}`}
                        onClick={() => {
                            setEditText(true);
                        }}
                    >
                        {todo.text}
                    </button>
                    <input
                        onChange={e => {
                            updateText(e.target.value);
                        }}
                        ref={inputRef}
                        placeholder={todo.text}
                        className={`flex-wrap px-1 text-sm font-[400] ${editText ? '' : 'hidden'}`}
                        type='text'
                    />
                    <button
                        onClick={() => {
                            setShowDatePicker(true);
                        }}
                        className='w-4/5 rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-100 lg:w-3/5'
                    >
                        <h3 className='text-[11px]'>{formatDate(date)}</h3>
                    </button>
                </div>
            </div>

            <TodoDatePicker show={showDatePicker} date={date} setShow={setShowDatePicker} text={todo.text} />
        </li>
    );
}
