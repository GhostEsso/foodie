import { Inter } from 'next/font/google';
import './globals.css';
import { getSession } from '../lib/auth';
import { ClientLayout } from '../components/layouts/client-layout';

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
        <ClientLayout session={session}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}