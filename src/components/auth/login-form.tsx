"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Se connecter
      </Button>

      <p className="text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-primary-600 hover:text-primary-700">
          S'inscrire
        </Link>
      </p>
    </form>
  );
} 