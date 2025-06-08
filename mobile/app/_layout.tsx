import SafeScreen from "@/components/SafeScreen";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

/**
 * RootLayout wraps the app with ClerkProvider for authentication
 * and SafeScreen for safe area handling.
 */
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        {/* Slot renders the active route's component */}
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
