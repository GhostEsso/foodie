import { useState, useCallback } from 'react';
import { SettingsFormState, PasswordUpdateData } from '../models/settings/settings-form.types';

export function useSettingsForm() {
  const [state, setState] = useState<SettingsFormState>({
    isLoading: false,
    error: '',
    success: ''
  });

  const resetMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: '',
      success: ''
    }));
  }, []);

  const handlePasswordUpdate = useCallback(async (formData: FormData) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: '',
      success: ''
    }));

    try {
      const currentPassword = formData.get('currentPassword') as string;
      const newPassword = formData.get('newPassword') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const data: PasswordUpdateData = {
        currentPassword,
        newPassword
      };

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du mot de passe');
      }

      setState(prev => ({
        ...prev,
        success: 'Mot de passe mis à jour avec succès',
        isLoading: false
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false
      }));

      return false;
    }
  }, []);

  return {
    ...state,
    handlePasswordUpdate,
    resetMessages
  };
} 