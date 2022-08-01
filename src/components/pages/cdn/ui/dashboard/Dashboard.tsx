import { AuthProvider } from '@hooks/useAuth';
import { FileClickProvider } from '@providers/FileClickProvider';
import { IdProvider } from '@providers/IdProvider';
import { FileModalProvider } from '@providers/FileModalProvider';
import Modals from './modals/Modals';
import Panel from './Panel';
import Sidebar from './Sidebar';
import Store from './store/Store';

export default function Dashboard() {
    return (
        <section className='mt-16 flex h-full'>
            <AuthProvider>
                <FileClickProvider>
                    <FileModalProvider>
                        <Modals />
                        <IdProvider>
                            <Panel />
                            <Store />
                        </IdProvider>
                        <Sidebar />
                    </FileModalProvider>
                </FileClickProvider>
            </AuthProvider>
        </section>
    );
}
