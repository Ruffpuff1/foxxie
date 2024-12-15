import { useElement } from '@reeseharlak/usehooks';
import { useEffect } from 'react';

export default function useHover(id: string, onEnter: (ev: MouseEvent) => any, onLeave?: (ev: MouseEvent) => any) {
    const element = useElement(id);

    useEffect(() => {
        if (element) {
            element.onmouseenter = onEnter;
            if (onLeave) element.onmouseleave = onLeave;
        }
    }, [element, onEnter, onLeave]);
}
