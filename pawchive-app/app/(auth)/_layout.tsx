import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Mock auth — replace with real auth later
const useAuth = () => {
  return { user: null, loading: false }; // Change to { user: true } when logged in
};

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)'); // Redirect to tabs if logged in
    }
  }, [user, loading]);

  if (loading) {
    return null; // Or show a loading spinner
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,  // ← This hides the header on ALL screens in this group
      }}
    >
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}