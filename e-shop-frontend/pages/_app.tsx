import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
