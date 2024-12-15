import { useElement, useScroll } from '@reeseharlak/usehooks';
import { RefObject, useState } from 'react';

/**
 * Check if an element is in viewport
 * @url https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * @param {number} offset - Number of pixels up to the observable element from the top
 */
export default function useVisibility<Element extends HTMLElement>(ref?: RefObject<Element> | string): [boolean, boolean] {
    const [isVisible, setIsVisible] = useState(false);
    const [atBottom, setAtBottom] = useState(false);
    const element = useElement(ref);

    useScroll(() => {
        if (!element) {
            setIsVisible(false);
            return;
        }

        const { top } = element.getBoundingClientRect();

        setIsVisible(top <= 55 && top >= -550);
        setAtBottom(top <= -200);
    }, [element]);

    return [isVisible, atBottom];
}
