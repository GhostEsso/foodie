import React from "react";
import { SignUpForm } from "../../components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Créer un compte
          </h1>
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
} 