import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { Web3OnboardProvider } from '@web3-onboard/react';
import { Layout } from 'components/layout';
import SnackController from 'components/snackbar/SnackController';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { web3Onboard } from 'store/Wallet';
import 'styles/globals.css';
import { ThemeContextProvider } from 'theme/themeContext';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache({ key: 'css', prepend: true });
export default function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: any) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>The CREDIT Protocol</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <RecoilRoot>
        <RecoilNexus />
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <ThemeContextProvider>
            <SnackController />
            <Layout>
              <main className={inter.className}>
                <Component {...pageProps} />
              </main>
            </Layout>
          </ThemeContextProvider>
        </Web3OnboardProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}
