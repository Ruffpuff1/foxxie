import { useRouter } from 'next/router';
import useNavbarScroll from '../../../hooks/useNavbarScroll';
import NavbarPageName from '../../ui/NavbarPageName';

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

export default function HireNavbar() {
    const router = useRouter();
    const [stick, scrolled] = useNavbarScroll();

    return (
        <header
            id='navbar'
            className={`fixed z-40 flex w-full items-center justify-between space-x-4 bg-white px-3 py-2 md:py-0 ${
                scrolled ? 'border-b border-b-gray-200' : 'border-b border-b-gray-200 shadow-sm md:border-none md:shadow-none'
            } ${stick ? 'top-0 shadow-md' : 'top-[-75px]'}`}
        >
            <NavbarPageName name={' Design'} link={'/hire'} />
            <div className='hidden items-center justify-center space-x-6 px-4 md:flex'>
                {Links.map(link => {
                    return (
                        <button
                            key={link.path}
                            onClick={e => {
                                e.preventDefault();
                                return router.push(link.path);
                            }}
                            className={`border-b-[3px] px-3 ${
                                router.pathname === link.path
                                    ? 'rounded-t-md border-b-blue-500 py-5'
                                    : 'my-1 rounded-md border-b-transparent py-4 duration-200 hover:bg-gray-100 hover:underline'
                            }`}
                        >
                            {link.text}
                        </button>
                    );
                })}
            </div>
        </header>
    );
}

interface Link {
    path: string;
    text: string;
}
