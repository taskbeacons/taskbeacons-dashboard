import { FirebaseError } from 'firebase/app';

/**
 * Translates Firebase Auth error codes into user-friendly messages.
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in instead.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please try again.';
      case 'auth/weak-password':
        return 'The password is too weak. Please use at least 8 characters.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      case 'auth/network-request-failed':
        return 'A network error occurred. Please check your internet connection.';
      case 'auth/requires-recent-login':
        return 'This operation is sensitive and requires recent authentication. Please log in again.';
      default:
        return error.message || 'An unexpected authentication error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};
