import { default as NavbarBase, Link } from '../../ui/Navbar/Navbar';

const Links: Link[] = [
    {
        text: 'About',
        path: '/about-me'
    },
    {
        text: 'Contact',
        path: '/contact-me'
    },
    {
        text: 'My work',
        path: '/my-work'
    }
    // {
    //     text: 'Pumpkin',
    //     path: '/about-me/dogs/pumpkin'
    // }
];

export default function Navbar({ hide = false }: { hide?: boolean }) {
    return <NavbarBase hide={hide} home='/about-me' title=' About' links={Links} />;
}
