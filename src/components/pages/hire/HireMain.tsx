import { ReactNode } from 'react';
import HomeFooter from '../../ui/HomeFooter';
import Navbar from './HireNavbar';

export default function HireMain({ children, className }: { children: ReactNode; name?: string; className?: string; baseUrl?: string }) {
    return (
        <>
            <Navbar />

            {children}

            <HomeFooter className={className} />
        </>
    );
}
