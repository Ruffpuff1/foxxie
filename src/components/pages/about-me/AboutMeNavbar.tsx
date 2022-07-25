import BaseNavbar, { Link } from '../../ui/BaseNavbar';

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

export default function AboutMeNavbar() {
    return (
        <>
            <BaseNavbar links={Links} title=' About' href='/about' />
        </>
    );
}
