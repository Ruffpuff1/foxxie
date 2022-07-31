import { NextPage } from 'next';
import { Colors } from '@assets/images';
import Head from 'next/head';
import Navbar from '@images/ui/Navbar';
import Dashboard from '@images/ui/dashboard/Dashboard';
import { SidebarProvider } from '@hooks/useTodo';

const Images: NextPage = () => {
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

export default Images;
