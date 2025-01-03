export interface SettingsFormProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SettingsFormState {
  isLoading: boolean;
  error: string;
  success: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface SettingsFormHandlers {
  handlePasswordUpdate: (formData: FormData) => Promise<void>;
  resetMessages: () => void;
} 