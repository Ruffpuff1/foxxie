import { useAuth } from '@hooks/useAuth';
import dynamic from 'next/dynamic';

const Icons = dynamic(() => import('./sidebar/icons/Icons'));
const TodoList = dynamic(() => import('./sidebar/todolist/TodoList'));

export default function Sidebar() {
    const [user] = useAuth();

    return (
        <>
            {user && (
                <>
                    <Icons />
                    <TodoList />
                </>
            )}
        </>
    );
}
