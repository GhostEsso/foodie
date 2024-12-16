"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function NavLinks({ session }: { session: any }) {
  return (
    <>
      <Link
        href="/dishes"
        className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
      >
        Plats disponibles
      </Link>
      {session && (
        <>
          <Link
            href="/dishes/new"
            className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
          >
            Proposer un plat
          </Link>
          <Link
            href="/bookings"
            className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
          >
            Mes réservations
          </Link>
        </>
      )}
    </>
  );
}

export function Header({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center">
              Foody
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <NavLinks session={session} />
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex items-center">
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">{session.name}</span>
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                    >
                      Déconnexion
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium ml-3"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`sm:hidden ${
            isOpen ? "block" : "hidden"
          } pb-3 transition-all duration-200 ease-in-out`}
        >
          <div className="flex flex-col space-y-2">
            <NavLinks session={session} />
            {session ? (
              <div className="border-t pt-3 mt-3">
                <span className="text-sm text-gray-700 px-3">{session.name}</span>
                <form action="/api/auth/logout" method="POST" className="mt-2">
                  <button
                    type="submit"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium w-full text-left"
                  >
                    Déconnexion
                  </button>
                </form>
              </div>
            ) : (
              <div className="border-t pt-3 mt-3 flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium mx-3"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 