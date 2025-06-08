import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

/**
 * AuthRoutesLayout handles authentication routes.
 * Redirects to root if already signed in.
 */
export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  // Redirect signed-in users away from auth screens
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  // Stack for auth screens (sign-in, sign-up)
  return <Stack screenOptions={{ headerShown: false }} />;
}