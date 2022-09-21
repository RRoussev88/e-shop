import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { AuthProvider } from '../context/AuthContext'
import '../styles/globals.css'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }) => (
  <AuthProvider>
    <Header />
    <main>
      <Component {...pageProps} />
    </main>
    <Footer />
  </AuthProvider>
)

export default MyApp
