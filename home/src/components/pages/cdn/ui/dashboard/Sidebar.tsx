import { useAuth } from '@hooks/useAuth';
import dynamic from 'next/dynamic';

const Icons = dynamic(() => import('./sidebar/icons/Icons'));
const TodoList = dynamic(() => import('./sidebar/todolist/TodoList'));

export default function Sidebar() {
    const [user, { message }] = useAuth();

    return (
        <>
            {user && message !== 'no-valid' && (
                <>
                    <Icons />
                    <TodoList />
                </>
            )}
        </>
    );
}
