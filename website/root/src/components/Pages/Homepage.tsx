import { Botlist } from '../Botlist';
import { Nav } from '../Nav';
import { Main } from '../Headers/Main';
import { Content } from '../Content';
import { Features } from '../Features/FeatureList';
import { Footer } from '../Footer';

export function Homepage() {
    return (
        <div>
            <Nav />

            <Content>
                <Main />

                <Botlist />

            </Content>

            <Features />

            <Footer />
        </div >
    );
}
