import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import { useContext } from 'react';
import { SidebarContext } from 'src/hooks/useTodo';

export default function TodoToggle() {
    const { showTodo, setShowTodo } = useContext(SidebarContext);

    return (
        <Tooltip id='todo-tooltip' title='Todo'>
            <button
                role='tab'
                aria-selected={showTodo}
                aria-labelledby='todo-tooltip'
                className='flex items-center justify-center rounded-full duration-200 hover:bg-gray-200'
                onClick={() => {
                    setShowTodo(!showTodo);
                }}
            >
                <Image id='todo-icon' aria-hidden height={28} className='m-1' width={28} src='https://rsehrk.com/images/icons/todo.png' alt='Todo' />
            </button>
        </Tooltip>
    );
}
