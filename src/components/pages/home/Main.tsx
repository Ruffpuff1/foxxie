import useLocale from '@hooks/useLocale';
import HomeFooter from '@ui/HomeFooter';
import Navbar from '@ui/Navbar/Navbar';
import { ReactNode } from 'react';

export default function Main({ children, className }: { children: ReactNode; className?: string }) {
    const [{ home }] = useLocale();

    return (
        <>
            <Navbar
                links={[
                    {
                        path: '/',
                        text: home.nav.home
                    },
                    {
                        path: '/contact-me',
                        text: home.nav.contact
                    }
                ]}
            />

            {children}

            <HomeFooter className={className} />
        </>
    );
}
