import { useRef, useEffect, useState, RefObject } from 'react';

/**
 * Check if an element is in viewport
 * @url https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * @param {number} offset - Number of pixels up to the observable element from the top
 */
export default function useVisibility<Element extends HTMLElement>(ref?: RefObject<Element> | string): [boolean, boolean, React.RefObject<Element>] {
    const [isVisible, setIsVisible] = useState(false);
    const [atBottom, setAtBottom] = useState(false);

    const [currentElement, setCurrentElement] = useState<HTMLElement>(null!);

    useEffect(() => {
        setCurrentElement(window.document.getElementById(ref as string)!);
    }, [ref]);

    const elmRef = useRef(currentElement);

    const onScroll = () => {
        if (!elmRef.current) {
            setIsVisible(false);
            return;
        }

        const { top } = elmRef.current.getBoundingClientRect();
        setIsVisible(top <= 55 && top >= -550);
        setAtBottom(top <= -200);
    };

    useEffect(() => {
        document.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('scroll', onScroll, true);
        };
    });

    return [isVisible, atBottom, elmRef as RefObject<Element>];
}
