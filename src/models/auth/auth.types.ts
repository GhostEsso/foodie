export interface VerifyEmailData {
  userId: string | null;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  error?: string;
}

export interface VerifyEmailState {
  code: string;
  error: string;
  isLoading: boolean;
} 