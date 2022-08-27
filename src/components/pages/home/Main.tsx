import useLocale from '@hooks/useLocale';
import HomeFooter from '@ui/HomeFooter';
import Navbar from '@ui/Navbar/Navbar';
import { ReactNode } from 'react';

export default function Main({ children, className, footer = true }: { children: ReactNode; className?: string; footer?: boolean }) {
    const [{ home, aboutMe }] = useLocale();

    return (
        <>
            <Navbar
                links={[
                    {
                        text: aboutMe.nav.about,
                        path: '/about-me'
                    },
                    {
                        path: '/contact-me',
                        text: home.nav.contact
                    },
                    {
                        text: aboutMe.nav.myWork,
                        path: '/my-work'
                    }
                ]}
            />

            {children}

            {footer && <HomeFooter className={className} />}
        </>
    );
}
