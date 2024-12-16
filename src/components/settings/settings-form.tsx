"use client";

import React, { useState } from "react";
import Button from "../ui/button";
import { User } from "lucide-react";

interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour du mot de passe");
      }

      setSuccess("Mot de passe mis à jour avec succès");
      e.currentTarget.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Informations de base */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="h-10 w-10 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Le nom et l'email ne peuvent pas être modifiés pour des raisons de sécurité.
        </p>
      </div>

      {/* Changement de mot de passe */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <Button type="submit" isLoading={isLoading}>
            Mettre à jour le mot de passe
          </Button>
        </form>
      </div>
    </div>
  );
} 