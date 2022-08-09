import { default as BaseNavbar } from '../../ui/Navbar/Navbar'

const Links: Link[] = [
    {
        text: 'About',
        path: '/about-me'
    },
    {
        text: 'My Work',
        path: '/my-work'
    },
    {
        text: 'Contact',
        path: '/contact-me'
    }
];

export default function Navbar() {
    return (
        <BaseNavbar  links={Links} title=' Design' home='/hire'  />
    );
}

interface Link {
    path: string;
    text: string;
}
