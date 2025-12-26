import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/utils/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false); // ← Prevents state updates during first render

  useEffect(() => {
    isMounted.current = true;

    // Load initial session asynchronously
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted.current) {
          setSession(session);
          setLoading(false);
        }
      } catch (err) {
        console.error('Session load error:', err);
        if (isMounted.current) setLoading(false);
      }
    };

    initializeAuth();

    // Auth change listener (only updates after mount)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted.current) {
        setSession(newSession);
        setLoading(false);
      }
    });

    return () => {
      isMounted.current = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (session && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/landing');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return null; // Prevent any flash
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}