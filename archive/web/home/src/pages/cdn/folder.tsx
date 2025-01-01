import Dashboard from '@cdn/ui/dashboard/Dashboard';
import Navbar from '@cdn/ui/Navbar';
import { SidebarProvider } from '@hooks/useTodo';
import { NextPage } from 'next';

const Folder: NextPage = () => {
    return (
        <>
            <SidebarProvider>
                <Navbar />
                <Dashboard />
            </SidebarProvider>
        </>
    );
};

export default Folder;
