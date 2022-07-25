import { useEffect, useState } from 'react';

/**
 * @link https://www.w3schools.com/howto/howto_js_navbar_hide_scroll.asp
 * @returns `[stick, scrolled]` - Stick being weather the navbar should be shown. Scrolled indicating weather the page has been scrolled.
 */
export default function useNavbarScroll(): [boolean, boolean] {
    const [stick, setStick] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let prevScrollPos = window.scrollY;
        const handleScoll = () => {
            const currentScroll = window.scrollY;

            if (prevScrollPos > currentScroll) {
                setStick(true);
            } else {
                setStick(false);
            }

            if (window.scrollY === 0) setStick(true);

            if (window.scrollY === 0) {
                setScrolled(false);
            } else {
                setScrolled(true);
            }

            prevScrollPos = currentScroll;
        };

        window.addEventListener('scroll', handleScoll);

        return () => {
            window.removeEventListener('scroll', handleScoll);
        };
    }, [stick, scrolled]);

    return [stick, scrolled];
}
