import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import FoxxieFooter from './FoxxieFooter';
import Navbar from './Navbar';

export default function FoxxieMain({ children, visible }: { children: ReactNode; visible?: boolean }) {
    const router = useRouter();

    return (
        <>
            <Navbar hide={router.pathname === '/foxxie/about' ? visible! : false} />

            {children}

            <FoxxieFooter />
        </>
    );
}
