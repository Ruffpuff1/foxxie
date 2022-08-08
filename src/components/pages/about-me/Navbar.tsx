import { default as NavbarBase } from '../../Navbar/Navbar';
import { Link } from '../../ui/BaseNavbar';

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
    },
    {
        text: 'Pumpkin',
        path: '/about-me/dogs/pumpkin'
    }
];

export default function Navbar() {
    return <NavbarBase home='/about-me' title=' About' links={Links} />;
}
