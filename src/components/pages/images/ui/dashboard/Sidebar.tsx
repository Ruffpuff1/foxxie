import { useAuth } from '@hooks/useAuth';
import { useState } from 'react';
import LargeTopIcons from './sidebar/LargeTopIcons';
import Todolist from './sidebar/todolist/Todolist';

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [user] = useAuth();

    return (
        <>
            {user && (
                <>
                    <LargeTopIcons open={open} setOpen={setOpen} />
                    <Todolist />
                </>
            )}
        </>
    );
}
