import { useRef, useEffect, useState } from 'react';

/**
 * Check if an element is in viewport
 * @url https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * @param {number} offset - Number of pixels up to the observable element from the top
 */
export default function useVisibility<Element extends HTMLElement>(): [boolean, boolean, React.RefObject<Element>] {
    const [isVisible, setIsVisible] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    const currentElement = useRef<Element>(null);

    const onScroll = () => {
        if (!currentElement.current) {
            setIsVisible(false);
            return;
        }
        const { top } = currentElement.current.getBoundingClientRect();
        setIsVisible(top <= 55 && top >= -550);
        setAtBottom(top <= -200);
    };

    useEffect(() => {
        document.addEventListener('scroll', onScroll, true);
        return () => {
            document.removeEventListener('scroll', onScroll, true);
        };
    });

    return [isVisible, atBottom, currentElement];
}
