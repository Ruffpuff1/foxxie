import { useEffect } from 'react';

export default function useHover(id: string, onEnter: (ev: MouseEvent) => any, onLeave?: (ev: MouseEvent) => any) {
    useEffect(() => {
        const element = document.getElementById(id);

        if (element) {
            element.onmouseenter = onEnter;
            if (onLeave) element.onmouseleave = onLeave;
        }
    });
}
