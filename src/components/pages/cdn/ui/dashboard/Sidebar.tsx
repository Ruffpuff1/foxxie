import { useAuth } from '@hooks/useAuth';
import Icons from './sidebar/icons/Icons';
import TodoList from './sidebar/todolist/TodoList';

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
