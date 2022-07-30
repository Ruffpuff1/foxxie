import { NextPage } from 'next';
import { Colors } from '@assets/images';
import { AuthProvider } from '@hooks/useAuth';
import { IdProvider } from '@providers/IdProvider';
import { FileClickProvider } from '@providers/FileClickProvider';
import Head from 'next/head';
import Navbar from '@images/ui/Navbar';
import Dashboard from '@images/ui/dashboard/Dashboard';
import { TodoProvider } from '@hooks/useTodo';

const Images: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/upload.png' />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>

            <AuthProvider>
                <IdProvider>
                    <FileClickProvider>
                        <TodoProvider>
                            <Navbar />
                            <Dashboard />
                        </TodoProvider>
                    </FileClickProvider>
                </IdProvider>
            </AuthProvider>
        </>
    );
};

export default Images;
