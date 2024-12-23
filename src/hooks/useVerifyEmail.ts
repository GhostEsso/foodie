import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VerifyEmailState } from "../models/auth/auth.types";

export function useVerifyEmail() {
  const [state, setState] = useState<VerifyEmailState>({
    code: "",
    error: "",
    isLoading: false
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const setCode = (code: string) => {
    setState(prev => ({ ...prev, code }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, error: "", isLoading: true }));

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, code: state.code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      router.push("/login?verified=true");
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Une erreur est survenue"
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    userId,
    code: state.code,
    error: state.error,
    isLoading: state.isLoading,
    setCode,
    handleSubmit
  };
} 