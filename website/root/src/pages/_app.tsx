import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.$discordMessage = {
      avatars: {
        default: 'blue',
        ruffpuff: 'https://cdn.ruffpuff.dev/ruffpuff.jpg'
      },
      profiles: {
        ruffpuff: {
          author: 'Ruffpuff',
          bot: false,
          avatar: 'https://cdn.ruffpuff.dev/ruffpuff.jpg'
        }
      }
    };

    document.documentElement.classList.add('bg-light-gray');
  }, []);
  return <Component {...pageProps} />;
}

export default App;
