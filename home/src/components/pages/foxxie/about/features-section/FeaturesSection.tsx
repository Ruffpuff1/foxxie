import useVisibility from '@hooks/useVisibility';
import { useSize } from 'ahooks';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const FoxxieDiscordUI = dynamic(() => import('./discord-ui/FoxxieDiscordUI'));
const FoxxieFeaturesList = dynamic(() => import('./discord-ui/FoxxieFeaturesList'));

export default function FeaturesSection({ setIsVisible }: { setIsVisible: (b: boolean) => void }) {
    const [visible] = useVisibility<HTMLDivElement>('discord-ui');

    useEffect(() => {
        setIsVisible(visible);
    }, [setIsVisible, visible]);

    const size = useSize(() => document.querySelector('body'));

    return <section id='discord-ui'>{(size?.width || 0) > 640 ? <FoxxieDiscordUI /> : <FoxxieFeaturesList />}</section>;
}
