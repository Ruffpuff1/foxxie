import { ReactNode } from 'react';
import HomeFooter from '@ui/HomeFooter';
import Navbar from './Navbar';

export default function AboutMain({ children, className, name, baseUrl }: { children: ReactNode; name?: string; className?: string; baseUrl?: string }) {
    return (
        <>
            <Navbar />

            {children}

            <HomeFooter className={className} />
        </>
    );
}
