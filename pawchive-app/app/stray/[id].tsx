import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';
import AdoptDrawer from '@/components/adopt';
import SponsorDrawer from '@/components/sponsor';
import HealthCardDrawer from '@/components/healthCard';

interface Stray {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  age?: string;
  weight?: string;
  location?: string;
  rescue_date?: string;
  status?: string;
  bio?: string;
  image_url?: string;
}

export default function StrayDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [stray, setStray] = useState<Stray | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [showAdoptDrawer, setShowAdoptDrawer] = useState(false);
  const [showSponsorDrawer, setShowSponsorDrawer] = useState(false);
  const [showHealthCard, setShowHealthCard] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid stray ID');
      setLoading(false);
      return;
    }

    const fetchStray = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('strays')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Stray not found');

        setStray(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load stray details';
        setError(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStray();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !stray) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Stray not found'}</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={{ uri: stray.image_url || 'https://via.placeholder.com/400' }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(tabs)/search')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsFavorited(!isFavorited)}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorited ? '#FF4444' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Basic Info Card */}
          <View style={styles.card}>
            <View style={styles.nameHeader}>
              <View>
                <Text style={styles.name}>{stray.name}</Text>
                <Text style={styles.breed}>{stray.breed || 'N/A'}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stray.status || 'Available'}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              {[
                ['Gender', stray.gender || 'N/A'],
                ['Age', stray.age || 'N/A'],
                ['Weight', stray.weight || 'N/A'],
                ['Location', stray.location || 'N/A'],
                ['Rescue Date', stray.rescue_date || 'N/A'],
              ].map(([label, value]) => (
                <View key={label} style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bio Card */}
          {stray.bio && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>About {stray.name}</Text>
              <Text style={styles.bio}>{stray.bio}</Text>
            </View>
          )}

          {/* Health Summary Card */}
          <View style={styles.card}>
            <View style={styles.healthHeader}>
              <MaterialIcons name="favorite" size={24} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Health Summary</Text>
            </View>

            <TouchableOpacity
              style={styles.healthCardButton}
              onPress={() => setShowHealthCard(true)}
            >
              <Text style={styles.healthCardButtonText}>View e-Health Card</Text>
            </TouchableOpacity>

            {/* Placeholder message */}
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 16, fontSize: 14 }}>
              No vaccination records available yet
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.adoptBtn}
            onPress={() => setShowAdoptDrawer(true)}
          >
            <Text style={styles.adoptText}>Adopt {stray.name}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sponsorBtn}
            onPress={() => setShowSponsorDrawer(true)}
          >
            <Text style={styles.sponsorText}>Sponsor</Text>
          </TouchableOpacity>
        </View>

        {/* Drawers */}
        <AdoptDrawer
          isVisible={showAdoptDrawer}
          onClose={() => setShowAdoptDrawer(false)}
          strayName={stray.name}
        />

        <SponsorDrawer
          isVisible={showSponsorDrawer}
          onClose={() => setShowSponsorDrawer(false)}
          strayName={stray.name}
        />

        <HealthCardDrawer
          isVisible={showHealthCard}
          onClose={() => setShowHealthCard(false)}
          stray={stray}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { height: 360, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
  },
  topActions: { position: 'absolute', top: 50, right: 20, gap: 12 },
  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
  },
  content: { flex: 1, paddingHorizontal: 20, marginTop: -40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  nameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: { fontSize: 32, fontWeight: 'bold' },
  breed: { fontSize: 16, color: '#666', marginTop: 4 },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  infoItem: { width: '45%' },
  infoLabel: { fontSize: 12, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  locationText: { marginLeft: 8, fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  bio: { fontSize: 15, lineHeight: 22, color: '#444' },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  healthTitle: { fontSize: 20, fontWeight: 'bold' },
  healthCardButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  healthCardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomActions: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    gap: 12,
  },
  adoptBtn: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  adoptText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sponsorBtn: {
    backgroundColor: '#FFB800',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  sponsorText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#dc2626', fontSize: 18, textAlign: 'center', marginBottom: 16 },
  backText: { color: '#2196F3', fontSize: 16, fontWeight: '600', marginTop: 16 },
});