import { AuthProvider } from '@hooks/useAuth';
import { IdProvider } from '@providers/IdProvider';
import Panel from './Panel';
import Sidebar from './Sidebar';
import Store from './store/Store';

export default function Dashboard() {
    return (
        <section className='mt-16 flex h-full'>
            <AuthProvider>
                <IdProvider>
                    <Panel />
                    <Store />
                </IdProvider>
                <Sidebar />
            </AuthProvider>
        </section>
    );
}
