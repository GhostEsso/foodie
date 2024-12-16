"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Users, Ban, CheckCircle, History, Building, Search } from "lucide-react";
import Button from "../ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface User {
  id: string;
  name: string;
  email: string;
  apartment: string;
  buildingId: string;
  building: {
    name: string;
  };
  isBlocked?: boolean;
}

interface UsersByBuilding {
  buildingName: string;
  count: number;
}

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usersByBuilding, setUsersByBuilding] = useState<UsersByBuilding[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filtrer les utilisateurs en fonction de la recherche et du bâtiment sélectionné
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.apartment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBuilding) {
      filtered = filtered.filter(user => user.building.name === selectedBuilding);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedBuilding, users]);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from frontend...");
      const response = await fetch("/api/admin/users");
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);
        
        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setError("Format de données invalide");
          return;
        }

        setUsers(data);
        setFilteredUsers(data);
        
        // Calculer les statistiques par bâtiment
        const buildingStats = data.reduce((acc: { [key: string]: number }, user: User) => {
          if (!user.building?.name) {
            console.warn("User without building name:", user);
            return acc;
          }
          const buildingName = user.building.name;
          acc[buildingName] = (acc[buildingName] || 0) + 1;
          return acc;
        }, {});

        const statsArray = Object.entries(buildingStats).map(([buildingName, count]) => ({
          buildingName,
          count: count as number
        }));

        console.log("Building stats:", statsArray);
        setUsersByBuilding(statsArray);
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);
        setError("Erreur lors du chargement des utilisateurs");
      }
    } catch (error) {
      console.error("Frontend error:", error);
      setError("Erreur lors du chargement des utilisateurs");
    }
  };

  const toggleBlockUser = async (userId: string, currentBlockedStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: !currentBlockedStatus }),
      });

      if (response.ok) {
        setSuccess(currentBlockedStatus ? "Utilisateur débloqué" : "Utilisateur bloqué");
        fetchUsers();
      } else {
        setError("Erreur lors de la modification du statut de l'utilisateur");
      }
    } catch (error) {
      setError("Erreur lors de la modification du statut de l'utilisateur");
    }
  };

  // Obtenir la liste unique des bâtiments
  const buildings = Array.from(new Set(users.map(user => user.building.name)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Statistiques */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold">Utilisateurs par bâtiment</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usersByBuilding}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="buildingName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-center text-gray-500">
            Total: {users.length} utilisateurs
          </p>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
        </div>

        {/* Filtres */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full rounded-xl border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Tous les bâtiments</option>
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-lg ${
                user.isBlocked ? "bg-red-50" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    {user.building.name} - Apt {user.apartment}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleBlockUser(user.id, user.isBlocked || false)}
                    variant="ghost"
                    className={user.isBlocked ? "text-green-600" : "text-red-600"}
                  >
                    {user.isBlocked ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    variant="ghost"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {selectedUser === user.id && (
                <div className="mt-4 p-3 bg-white rounded-lg border text-sm">
                  <p className="text-gray-500">Historique des activités à venir...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 