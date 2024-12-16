import React from "react";
import { getSession } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { DishForm } from "../../../components/dishes/dish-form";

export default async function NewDishPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Proposer un plat
          </h1>

          <div className="bg-white rounded-2xl shadow-soft p-8">
            <DishForm />
          </div>
        </div>
      </div>
    </div>
  );
} 