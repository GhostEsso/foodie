"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import Button from "../../../components/ui/button";
import BuildingManager from "../../../components/admin/building-manager";
import UserManager from "../../../components/admin/user-manager";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Tableau de bord
            <Shield className="h-8 w-8 text-primary-600" />
          </h1>
          <Button onClick={handleLogout} variant="ghost">
            Se déconnecter
          </Button>
        </div>

        <div className="grid gap-6">
          <UserManager />
          <BuildingManager />
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600">
              Bienvenue dans votre espace administrateur. Ici, vous pourrez gérer les plats,
              les commandes et les utilisateurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 