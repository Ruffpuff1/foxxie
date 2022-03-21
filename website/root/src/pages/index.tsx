import type { NextPage } from 'next';
import { Botlist } from '../components/Botlist';
import { Nav } from '../components/Nav';
import { Main } from '../components/Headers/Main';
import { Content } from '../components/Content';

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

      <div className='bottom-1 absolute bg-gray w-full h-16 text-light-white text-sm pt-2 space-y-1'>
        <div className='flex justify-center space-x-5'>
          <a
            href='mailto:contact@ruffpuff.dev'
            target='_blank'
            rel="noreferrer"
            className='hover:underline'
          >
            contact@ruffpuff.dev
          </a>
          <p>
            Copyright © Foxxie 2021
          </p>
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
