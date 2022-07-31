import { useContext } from 'react';
import { SidebarContext } from 'src/hooks/useTodo';

export default function TodoToggle() {
    const { showTodo, setShowTodo } = useContext(SidebarContext);

    return (
        <button
            role='tab'
            aria-selected={showTodo}
            aria-labelledby='todo-icon'
            className='flex items-center justify-center rounded-full duration-200 hover:bg-gray-200'
            onClick={() => {
                setShowTodo(!showTodo);
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img id='todo-icon' height={28} className='m-1' width={28} src='https://reese.cafe/images/icons/todo.png' alt='Todo' />
        </button>
    );
}
