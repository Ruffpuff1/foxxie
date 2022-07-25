import { useEffect } from 'react';
import useVisibility from '../../../../../hooks/useVisibility';
import FoxxieDiscordUI from './discord-ui/FoxxieDiscordUI';
import FoxxieFeaturesList from './discord-ui/FoxxieFeaturesList';

export default function FeaturesSection({ setIsVisible }: { setIsVisible: (b: boolean) => void }) {
    const [visible, , ref] = useVisibility<HTMLDivElement>();

    useEffect(() => {
        setIsVisible(visible);
    }, [setIsVisible, visible]);

    return (
        <section id='discord-ui' ref={ref}>
            <FoxxieDiscordUI />
            <FoxxieFeaturesList />
        </section>
    );
}
