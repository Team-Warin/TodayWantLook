import type { AppProps } from 'next/app';

import { Providers } from '../components/provider/Providers';

import '../app/globals.css';

/**
 * pages 최상위 컴포넌트
 */
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
