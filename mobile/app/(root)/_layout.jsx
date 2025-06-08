import { Stack } from 'expo-router/stack'
import { useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'

/**
 * RootLayout for main app routes.
 * Redirects to sign-in if not authenticated.
 */
export default function RootLayout() {
  const { isSignedIn, isLoaded } = useUser();

  // Wait for Clerk to load user state
  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  // Stack for main app screens (index, create, etc.)
  return <Stack screenOptions={{ headerShown: false }} />;
}