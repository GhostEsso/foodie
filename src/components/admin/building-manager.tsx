"use client";

import React from "react";
import { useState, useEffect } from "react";
import Button from "../ui/button";
import { Building, Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BuildingType {
  id: string;
  name: string;
}

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

export default function BuildingManager() {
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await fetch("/api/buildings");
      if (response.ok) {
        const data = await response.json();
        setBuildings(data);
      }
    } catch (error) {
      setError("Erreur lors du chargement des bâtiments");
    }
  };

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newBuildingName.trim()) {
      setError("Le nom du bâtiment ne peut pas être vide");
      return;
    }

    try {
      const response = await fetch("/api/buildings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newBuildingName }),
      });

      if (response.ok) {
        setNewBuildingName("");
        setSuccess("Bâtiment ajouté avec succès");
        fetchBuildings();
      } else {
        setError("Erreur lors de l'ajout du bâtiment");
      }
    } catch (error) {
      setError("Erreur lors de l'ajout du bâtiment");
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    try {
      const response = await fetch(`/api/buildings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Bâtiment supprimé avec succès");
        fetchBuildings();
      } else {
        setError("Erreur lors de la suppression du bâtiment");
      }
    } catch (error) {
      setError("Erreur lors de la suppression du bâtiment");
    }
  };

  // Données pour le graphique
  const chartData = buildings.map((building, index) => ({
    name: building.name,
    value: 1,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Section graphique */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold">Vue d'ensemble</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-gray-900">{buildings.length}</p>
            <p className="text-gray-500">Bâtiments au total</p>
          </div>
        </div>
      </div>

      {/* Section gestion */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold">Gestion des bâtiments</h2>
        </div>

        <form onSubmit={handleAddBuilding} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newBuildingName}
                onChange={(e) => setNewBuildingName(e.target.value)}
                placeholder="Nom du bâtiment"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </form>

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
          {buildings.map((building) => (
            <div
              key={building.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">{building.name}</span>
              <Button
                onClick={() => handleDeleteBuilding(building.id)}
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 