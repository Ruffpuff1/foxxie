import useLocale from '@hooks/useLocale';
import { default as NavbarBase } from '@ui/Navbar/Navbar';

export default function Navbar({ hide = false }: { hide?: boolean }) {
    const [{ aboutMe }] = useLocale();

    return (
        <NavbarBase
            links={[
                {
                    text: aboutMe.nav.about,
                    path: '/about-me'
                },
                {
                    text: aboutMe.nav.contact,
                    path: '/contact-me'
                },
                {
                    text: aboutMe.nav.myWork,
                    path: '/my-work'
                }
            ]}
            home='/about-me'
            title=' About'
            hide={hide}
        />
    );
}
