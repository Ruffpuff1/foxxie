import { database } from '@utils/firebase';
import { addDoc, Timestamp } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { AuthContext } from '@hooks/useAuth';
import { useClickOutside } from '@ruffpuff/usehooks';

export default function TodoPlaceholder(props: { placeholder: string; setPlaceholder: (p: string) => void; list: string }) {
    const [name, setName] = useState('');
    const [editText, setEditText] = useState(true);

    const user = useContext(AuthContext);

    const [inputRef] = useClickOutside<HTMLInputElement>(() => {
        setEditText(false);
        props.setPlaceholder('');
        return name === '' ? undefined : addTodo();
    }, [editText]);

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
            completeBy: ts,
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
                        className={`cursor-pointer flex-wrap text-sm font-[400] ${editText ? 'hidden' : ''}`}
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
                        ref={inputRef}
                        placeholder='Title'
                        className={`flex-wrap text-sm font-[400] ${editText ? '' : 'hidden'}`}
                        type='text'
                    />
                    <div className='w-3/5 rounded-full border border-gray-200 bg-white px-3 py-1'>
                        <h3 className='text-[11px]'>{formatDate(new Date())}</h3>
                    </div>
                </div>
            </div>
        </li>
    );
}
