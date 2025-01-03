"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Settings, LogOut, User, Shield } from 'lucide-react';
import { NotificationMenu } from './notifications/notification-menu';
import { usePathname } from 'next/navigation';

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

function UserMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-5 w-5 text-primary-600" />
          </div>
          <span>{session.name}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
              <Link
                href="/dishes/my-bookings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Réservations reçues
              </Link>
              <Link
                href="/dishes/my-reservations"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Réservations en attente
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Messages
              </Link>
              <form action="/api/auth/logout" method="POST" onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch("/api/auth/logout", {
                    method: "POST",
                  });
                  if (response.ok) {
                    localStorage.removeItem("isAdminLoggedIn");
                    window.location.href = "/";
                  }
                } catch (error) {
                  console.error("Erreur lors de la déconnexion:", error);
                }
              }}>
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdminLoggedIn");
    setIsAdmin(adminStatus === "true");
  }, []);

  useEffect(() => {
    if (isAdminPage && !isAdmin && !isAdminLoginPage) {
      window.location.href = '/admin/login';
    }
  }, [isAdminPage, isAdmin, isAdminLoginPage]);

  return (
    <header className="bg-white border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="font-['Segoe_UI'] text-2xl font-black tracking-tighter text-[#1b74e4] flex items-center"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
            >
              foody
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {!isAdminPage && <NavLinks session={session} />}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex items-center">
              {isAdminPage ? (
                isAdmin && !isAdminLoginPage && (
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                  >
                    <Shield className="h-5 w-5" />
                  </Link>
                )
              ) : session ? (
                <>
                  <div className="flex items-center gap-2">
                    <NotificationMenu />
                  </div>
                  <UserMenu session={session} />
                </>
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
            <div className="sm:hidden flex items-center gap-2">
              {session && !isAdminPage && (
                <div className="flex items-center gap-2">
                  <NotificationMenu />
                </div>
              )}
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
            {!isAdminPage && <NavLinks session={session} />}
            {isAdminPage ? (
              isAdmin && !isAdminLoginPage && (
                <div className="border-t pt-3 mt-3">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Shield className="h-5 w-5" />
                  </Link>
                </div>
              )
            ) : session ? (
              <div className="border-t pt-3 mt-3">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
                <Link
                  href="/dishes/my-bookings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  Réservations reçues
                </Link>
                <Link
                  href="/dishes/my-reservations"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  Réservations en attente
                </Link>
                <form action="/api/auth/logout" method="POST" onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch("/api/auth/logout", {
                      method: "POST",
                    });
                    if (response.ok) {
                      localStorage.removeItem("isAdminLoggedIn");
                      window.location.href = "/";
                    }
                  } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                  }
                }}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </form>
              </div>
            ) : (
              !isAdminPage && (
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
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 