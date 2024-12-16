"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../ui/button";

interface Building {
  id: string;
  name: string;
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    fetch("/api/buildings")
      .then((res) => res.json())
      .then(setBuildings)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email")?.toString(),
      password: formData.get("password")?.toString(),
      name: formData.get("name")?.toString(),
      buildingId: formData.get("buildingId")?.toString(),
      apartment: formData.get("apartment")?.toString(),
    };

    if (!data.email || !data.password || !data.name || !data.buildingId || !data.apartment) {
      setError("Tous les champs sont requis");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || "Erreur lors de l'inscription");
      }

      window.location.href = "/login?message=Inscription réussie ! Vous pouvez maintenant vous connecter.";
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

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

        <div>
          <label htmlFor="buildingId" className="block text-sm font-medium text-gray-700 mb-1">
            Bâtiment
          </label>
          <select
            id="buildingId"
            name="buildingId"
            required
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Sélectionner un bâtiment</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro d'appartement
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            required
            placeholder="Ex: A101"
            className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          S'inscrire
        </Button>

        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary-600 hover:text-primary-700">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
} 