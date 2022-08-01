import { SidebarContext } from '@hooks/useTodo';
import { useContext } from 'react';
import TodoToggle from '../toggles/TodoToggle';

export default function SmallBottomIcons({ open }: { open: boolean }) {
    const { showTodo } = useContext(SidebarContext);

    return (
        <div
            className={`fixed bottom-0 z-[.5] flex overflow-hidden bg-white duration-300 ease-in ${
                open && !showTodo ? 'right-0 w-[6rem] border py-2 px-3 shadow-lg' : 'right-[-2rem] w-0'
            } lg:w-0 lg:border-none lg:py-0 lg:px-0`}
        >
            <TodoToggle />
        </div>
    );
}
