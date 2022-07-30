import { TodoContext, useTodo } from '@hooks/useTodo';
import { useContext } from 'react';
import Panel from './Panel';
import Sidebar from './Sidebar';
import Store from './store/Store';

export default function Dashboard() {
    const [tasks] = useTodo();
    const { showTodo } = useContext(TodoContext);

    return (
        <section className='mt-16 flex h-full'>
            <Panel />
            <Store showTodo={showTodo} />
            <Sidebar />
        </section>
    );
}
