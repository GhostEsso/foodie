interface Session {
  id: string;
  name: string;
  email: string;
}

export const getClientSession = async (): Promise<Session | null> => {
  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    return null;
  }
}; 