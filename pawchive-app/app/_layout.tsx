import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Load initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error loading initial session:', error);
        } else {
          console.log('Initial session loaded:', initialSession ? 'Logged in' : 'Not logged in');
          setSession(initialSession);
        }
      } catch (err) {
        console.error('Unexpected error during session load:', err);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes (login, logout, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', newSession ? 'Logged in' : 'Logged out');
      setSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Perform redirect only after auth is ready
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inStrayRoute = segments[0] === 'stray';

    if (session && !(inTabsGroup || inStrayRoute)) {
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/landing');
    }

  }, [session, isReady, segments, router]);

  // Show nothing until auth decision is made (prevents flash of wrong screen)
  if (!isReady) {
    return null; // Or replace with a <SplashScreen /> component
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}