import { NextPage } from 'next';
import { Colors } from '@assets/images';
import Head from 'next/head';
import Navbar from '@cdn/ui/Navbar';
import Dashboard from '@cdn/ui/dashboard/Dashboard';
import { SidebarProvider } from '@hooks/useTodo';

const Folder: NextPage = () => {
    return (
        <>
            <Head>
                <link rel='icon' href='https://reese.cafe/images/icons/upload.png' />
                <meta name='theme-color' content={Colors.RuffGray} />
            </Head>

            <SidebarProvider>
                <Navbar />
                <Dashboard />
            </SidebarProvider>
        </>
    );
};

export default Folder;
