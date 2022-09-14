import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { AuthProvider } from '../context/AuthContext'
import '../styles/globals.css'

/**
 * 1: Implement Authentication - https://dev.to/strapi/implementing-strapi-v4-authentication-with-remix-464c
 * a. Make Strapi pass the JWT in a httpOnly cookie somehow. DONE
 * b. Make NextJS attach the cookie with the JWT to every request. DONE: The browser does that auomtically
 * c. Use that as a middleware for every request to the backend. DONE: The browser does that auomtically
 *
 * 2: Implement Orders display in account page - FE
 *
 * 3: OPTIONALY: Continue with video. Next step `strype`
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  )
}

export default MyApp
