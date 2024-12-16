import React from "react";
import { getSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "../../components/settings/settings-form";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Paramètres du compte
          </h1>

          <div className="bg-white rounded-2xl shadow-soft p-8">
            <SettingsForm user={session} />
          </div>
        </div>
      </div>
    </div>
  );
} 