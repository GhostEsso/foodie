import Link from 'next/link'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSession } from '../lib/auth'
import React from 'react'
import { Header } from '../components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Foody - Partagez des plats avec vos voisins',
  description: 'Découvrez et partagez des plats faits maison avec vos voisins',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();

  return (
    <html lang="fr" className={inter.className}>
      <body className="flex flex-col min-h-screen">
        <Header session={session} />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                  À propos
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  Foody est une plateforme qui permet de partager des plats faits maison avec vos voisins.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                  Liens utiles
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                      Comment ça marche
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
                  Légal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                      Politique de confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                      Conditions d'utilisation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 text-center">
              <p className="text-base text-gray-400">
                &copy; {new Date().getFullYear()} Foody. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}