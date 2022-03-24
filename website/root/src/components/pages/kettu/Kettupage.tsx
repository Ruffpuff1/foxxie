import { Nav } from '../../navigation/Nav';
import { Content } from '../../presentational/Content';
import { Footer } from '../../headers/Footer';
import { Kettu } from '../../headers/Kettu';

export function Kettupage() {
    return (
        <div>
            <Nav />

            <Content>
                <Kettu />

                <Footer />

            </Content>
        </div >
    );
}
