import Navbar, { Link } from '@ui/Navbar/Navbar';
import { ReactNode } from 'react';
import HomeFooter from '@ui/HomeFooter';

const links: Link[] = [
    {
        path: '/',
        text: 'Home'
    },
    {
        path: '/contact-me',
        text: 'Contact'
    }
];

export default function Main({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <>
            <Navbar links={links} />

            {children}

            <HomeFooter className={className} />
        </>
    );
}
