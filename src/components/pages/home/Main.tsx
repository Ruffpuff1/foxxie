import { ReactNode } from 'react';
import Navbar, { Link } from 'src/components/Navbar/Navbar';
import HomeFooter from '../../ui/HomeFooter';

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

export default function Main({ children, className, name, baseUrl }: { children: ReactNode; name?: string; className?: string; baseUrl?: string }) {
    return (
        <>
            <Navbar links={links} />

            {children}

            <HomeFooter className={className} />
        </>
    );
}
