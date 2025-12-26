import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Mock auth — replace with real auth later
const useAuth = () => {
  return { user: null, loading: false }; // Set user: { id: 1 } to test logged-in redirect
};

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}