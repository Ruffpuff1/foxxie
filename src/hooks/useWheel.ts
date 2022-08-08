import { useEffect } from 'react';

export default function useWheel(onWheel: (ev: globalThis.WheelEvent) => any) {
    useEffect(() => {
        window.addEventListener('wheel', onWheel);

        return () => {
            window.removeEventListener('wheel', onWheel);
        };
    });
}
