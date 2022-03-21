import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.documentElement.classList.add('bg-light-gray');
  })
  return <Component {...pageProps} />
}

export default App
