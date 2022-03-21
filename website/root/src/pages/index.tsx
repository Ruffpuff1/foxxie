import type { NextPage } from 'next';
import { Botlist } from '../components/Botlist';
import { Nav } from '../components/Nav';
import { Main } from '../components/Headers/Main';
import { Content } from '../components/Content';
import { Features } from '../components/Features/FeatureList';

const links = [
  {
    text: 'Support',
    link: 'https://ruffpuff.dev/community'
  },
  {
    text: 'Github',
    link: 'https://github.com/FoxxieBot'
  },
  {
    text: 'Ko-fi',
    link: 'https://ko-fi.com/ruffpuff'
  }
];

const Home: NextPage = () => {
  return (
    <div>
      <Nav />

      <Content>
        <Main />

        <Botlist />

      </Content>

      <Features />

      <div className='bottom-0 static bg-gray w-full mt-32 md:mt-52 sm:mt-52 lg:h-16 xl:h-16 md:h-36 sm:h-32 h-36 text-light-white text-sm pt-2 space-y-1 transition-all duration-300'>
        <div className='flex justify-center space-x-5'>
          <a
            href='mailto:contact@ruffpuff.dev'
            target='_blank'
            rel="noreferrer"
            className='hover:underline'
          >
            contact@ruffpuff.dev
          </a>
          <a
            href='https://github.com/FoxxieBot/foxxie/blob/main/LICENSE'
            target='_blank'
            rel="noreferrer"
            className='hover:underline'
          >
            Copyright © Foxxie 2021
          </a>
        </div>
        <div className='flex justify-center space-x-5'>
          {
            links.map(link => {
              return (
                <a
                  key={link.text}
                  href={link.link}
                  target='_blank'
                  rel="noreferrer"
                  className='hover:underline'
                >
                  {link.text}
                </a>
              );
            })
          }
        </div>
      </div>
    </div >
  );
};

export default Home;
