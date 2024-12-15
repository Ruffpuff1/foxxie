import { useAuth } from '@hooks/useAuth';
import { useClickOutside } from '@reeseharlak/usehooks';
import { database } from '@util/firebase';
import { addDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function TaskListCreator({ show, setShow }: { show: boolean; setShow: (b: boolean) => void }) {
    const [name, setName] = useState('');
    const [user] = useAuth();

    const onDone = async () => {
        await addDoc(database.todoLists, {
            name,
            userId: user?.uid,
            sortBy: 'my-order'
        });

        setShow(false);
        setName('');
    };

    const onClose = () => {
        setShow(false);
        setName('');
    };

    useClickOutside(onClose, 'todo-tasklist-creator');

    return (
        <div className={`fixed top-0 right-0 z-[6] flex h-full w-72 items-center justify-center bg-black bg-opacity-30 ${show ? '' : 'hidden'}`}>
            <div id='todo-tasklist-creator' className='flex h-36 w-60 flex-col justify-evenly rounded-md bg-white py-2 pl-4 shadow-md'>
                <h2 className='text-sm'>Create a new list</h2>
                <div>
                    <input
                        type='text'
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        value={name || undefined}
                        placeholder='Enter name'
                        className='rounded-sm border-b border-b-gray-200 bg-gray-100 p-1 text-sm focus:border-b-blue-500 focus:outline-none'
                    />
                </div>
                <div className='mr-6 flex items-center justify-end text-sm'>
                    <div className='flex items-center justify-between space-x-2'>
                        <button onClick={onClose} className='rounded-md py-1 px-2 duration-500 hover:bg-gray-200'>
                            Cancel
                        </button>
                        <button onClick={onDone} className='rounded-md py-1 px-2 text-blue-500 duration-500 hover:bg-gray-200'>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
