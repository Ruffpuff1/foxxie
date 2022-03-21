import type { NextPage } from 'next';
import { Botlist } from '../components/Botlist';
import { Nav } from '../components/Nav';
import { Main } from '../components/Headers/Main';
import { Content } from '../components/Content'

const Home: NextPage = () => {
  return (
    <div>
      <Nav />

      <Content>
        <Main />

        <Botlist />
      </Content>
    </div >
  );
};

export default Home;
