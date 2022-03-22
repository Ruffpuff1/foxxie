import { Botlist } from '../presentational/Botlist';
import { Nav } from '../navigation/Nav';
import { Main } from '../headers/Main';
import { Content } from '../presentational/Content';
import { Footer } from '../navigation/Footer';

export function Homepage() {
    return (
        <div>
            <Nav />

            <Content>
                <Main />

                <Botlist />

            </Content>

            <Footer />
        </div >
    );
}
