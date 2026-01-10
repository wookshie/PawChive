import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase'; // ← Your Supabase client import (adjust path)

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const [featuredStrays, setFeaturedStrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const steps = [
    { icon: require('../../assets/step-find.png'), title: 'Find a Stray', desc: 'Browse available campus strays looking for homes and care.' },
    { icon: require('../../assets/step-track.png'), title: 'Learn Their Story', desc: 'View health records, vaccination history, and rescue stories.' },
    { icon: require('../../assets/step-adopt.png'), title: 'Give Them a Future', desc: 'Adopt, sponsor, or volunteer to help campus strays.' },
  ];

  // Mock recent activity (you can fetch this from Supabase later)
  const recentActivity = [
    { icon: 'syringe', action: 'Charlie received vaccination', time: '2 hours ago', color: '#FF6B6B' },
    { icon: 'heart', action: 'Bella found a sponsor', time: '5 hours ago', color: '#ff4081' },
    { icon: 'home', action: 'Rocky was adopted!', time: '1 day ago', color: '#4CAF50' },
  ];

  // Fetch featured strays from Supabase (latest 3)
  const fetchFeaturedStrays = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('strays')
        .select('id, name, breed, location, status, image_url')
        .order('created_at', { ascending: false })
        .limit(3); // Show only 3 featured

      if (error) throw error;
      setFeaturedStrays(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching featured strays:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedStrays();

    // Real-time subscription for auto-update
    const channel = supabase
      .channel('strays-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'strays' },
        () => {
          console.log('Stray data changed - refreshing featured list');
          fetchFeaturedStrays();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFeaturedStrays]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeaturedStrays();
  }, [fetchFeaturedStrays]);

  return (
    <View style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo-pawchive.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.appName}>PawChive</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.section}>
          <Image source={require('../../assets/hero-campus.jpg')} style={styles.heroImage} />
          <Text style={styles.heroTitle}>A Smarter Way to Care for Campus Strays</Text>
          <Text style={styles.heroSubtitle}>From Health to Adoption</Text>
          <TouchableOpacity style={styles.accentButton} onPress={() => router.push('/search')}>
            <Text style={styles.accentButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Steps */}
        <View style={styles.stepsSection}>
          <Text style={[styles.sectionTitle, { fontWeight: 'bold' }]}>Give a Stray a Chance in</Text>
          <Text style={styles.heroSubtitle}>3 Simple Steps</Text>

          {steps.map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <Image source={step.icon} style={styles.stepIcon} />
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.accentButton} onPress={() => router.push('/search')}>
            <Text style={styles.accentButtonText}>Browse Strays</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Strays - Now from Supabase */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.boldSectionTitle}>Featured Strays</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          ) : error ? (
            <Text style={{ color: '#dc2626', textAlign: 'center' }}>Error loading featured strays</Text>
          ) : featuredStrays.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center' }}>No featured strays yet</Text>
          ) : (
            featuredStrays.map((stray) => (
              <TouchableOpacity
                key={stray.id}
                style={styles.strayCard}
                onPress={() => router.push(`/stray/${stray.id}`)}
              >
                <Image
                  source={{ uri: stray.image_url || 'https://via.placeholder.com/300' }}
                  style={styles.strayImage}
                  resizeMode="cover"
                />
                <View style={styles.strayInfo}>
                  <Text style={styles.strayName}>{stray.name}</Text>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={14} color="#666" />
                    <Text style={styles.strayLocation}>{stray.location}</Text>
                  </View>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{stray.status || 'Available'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <MaterialIcons name="timeline" size={28} color="#FF6B6B" />
            <Text style={styles.boldSectionTitle}>Recent Activity</Text>
          </View>
          {recentActivity.map((act, i) => (
            <View key={i} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: act.color + '20' }]}>
                {act.icon === 'syringe' && <MaterialIcons name="vaccines" size={28} color={act.color} />}
                {act.icon === 'heart' && <Ionicons name="heart" size={28} color={act.color} />}
                {act.icon === 'home' && <Ionicons name="home" size={28} color={act.color} />}
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityAction}>{act.action}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* E-Health Card */}
        <View style={styles.healthSection}>
          <Text style={styles.healthTitle}>
            <Text style={styles.successText}>Your Pet's</Text> E-Health Card
          </Text>
          <Text style={styles.healthSubtitle}>Track vaccinations, medical history, and appointments</Text>

          <Image source={require('../../assets/health-cards.png')} style={styles.healthImage} resizeMode="contain" />

          <View style={styles.statsGrid}>
            <View style={styles.statCardPrimary}>
              <MaterialIcons name="coronavirus" size={32} color="#FF6B6B" />
              <Text style={styles.statLabel}>Vaccinations</Text>
              <Text style={styles.statValuePrimary}>8</Text>
            </View>
            <View style={styles.statCardSuccess}>
              <MaterialIcons name="calendar-today" size={32} color="#4CAF50" />
              <Text style={styles.statLabel}>Check-ups</Text>
              <Text style={styles.statValueSuccess}>12</Text>
            </View>
            <View style={styles.statCardAccent}>
              <MaterialIcons name="favorite" size={32} color="#FFB800" />
              <Text style={styles.statLabel}>Wellness</Text>
              <Text style={styles.statValueAccent}>95%</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.successButton}>
            <Text style={styles.successButtonText}>Access E-Health Card</Text>
          </TouchableOpacity>
        </View>

        {/* Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCenter}>Our Impact Together</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactCardPrimary}><Text style={styles.impactNum}>127</Text><Text style={styles.impactLabel}>Strays Rescued</Text></View>
            <View style={styles.impactCardSuccess}><Text style={styles.impactNumGreen}>89</Text><Text style={styles.impactLabel}>Pets Adopted</Text></View>
            <View style={styles.impactCardAccent}><Text style={styles.impactNumYellow}>245</Text><Text style={styles.impactLabel}>Active Sponsors</Text></View>
            <View style={styles.impactCardPink}><Text style={styles.impactNumPink}>1.2k</Text><Text style={styles.impactLabel}>Vaccinations</Text></View>
          </View>
        </View>

        {/* Final CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Make a Difference?</Text>
          <Text style={styles.ctaDesc}>
            Join our community of animal lovers and help give campus strays a better life
          </Text>
          <TouchableOpacity style={styles.accentButtonLarge} onPress={() => router.push('/search')}>
            <Text style={styles.accentButtonTextLarge}>Explore Strays</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
  logoEmoji: { fontSize: 20 },
  appName: { fontSize: 20, fontWeight: 'bold' },
  qrButton: { padding: 8 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  section: { padding: 20 },
  heroImage: { width: '100%', height: 200, borderRadius: 24, marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 18, color: '#FFB800', textAlign: 'center', fontWeight: '600', marginBottom: 16 },
  accentButton: { backgroundColor: '#FFB800', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, alignSelf: 'center' },
  accentButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  stepsSection: { backgroundColor: '#fffef5', padding: 20 },
  sectionTitle: { fontSize: 24, textAlign: 'center' },
  accentTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFB800', textAlign: 'center', marginBottom: 20 },
  stepCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  stepIcon: { width: 80, height: 80, marginBottom: 12 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  stepDesc: { textAlign: 'center', color: '#666', lineHeight: 20 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { color: '#007AFF', fontWeight: '600' },

  logoContainer: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#57AFDB',},
  logoImage: { width: 44, height: 44},
  appName: { fontSize: 22, fontWeight: 'bold', marginLeft: 10, },

  safeContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    // Android: Get exact height of status bar + 10px buffer
    // iOS: Hardcode ~50px (covers notches and dynamic islands)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 50,
  },

  strayCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  strayImage: { width: 70, height: 70, borderRadius: 35, marginRight: 16 },

  strayInfo: { flex: 1 },
  strayName: { fontSize: 18, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  strayLocation: { fontSize: 13, color: '#666', marginLeft: 4 },
  badge: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  boldSectionTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 16,
},

  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12 },
  activityIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FF6B6B10', justifyContent: 'center', alignItems: 'center' },
  activityEmoji: { fontSize: 24 },
  activityText: { marginLeft: 16, flex: 1 },
  activityAction: { fontWeight: '600' },
  activityTime: { fontSize: 12, color: '#999', marginTop: 4 },

  healthSection: { padding: 20, backgroundColor: '#f0fff4' },
  healthTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  successText: { color: '#4CAF50' },
  healthSubtitle: { textAlign: 'center', color: '#666', marginBottom: 20 },
  healthImage: { width: '100%', height: 160, marginBottom: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statCardPrimary: { backgroundColor: '#FF6B6B10', padding: 16, borderRadius: 16, alignItems: 'center', width: 100 },
  statCardSuccess: { backgroundColor: '#4CAF5010', padding: 16, borderRadius: 16, alignItems: 'center', width: 100 },
  statCardAccent: { backgroundColor: '#FFB80010', padding: 16, borderRadius: 16, alignItems: 'center', width: 100 },
  statLabel: { fontSize: 12, marginTop: 8, color: '#666' },
  statValuePrimary: { fontSize: 20, fontWeight: 'bold', color: '#FF6B6B', marginTop: 4 },
  statValueSuccess: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginTop: 4 },
  statValueAccent: { fontSize: 20, fontWeight: 'bold', color: '#FFB800', marginTop: 4 },
  successButton: { backgroundColor: '#4CAF50', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, alignSelf: 'center' },
  successButtonText: { color: '#fff', fontWeight: 'bold' },

  sectionTitleCenter: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  impactGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  impactCardPrimary: { backgroundColor: '#FF6B6B10', padding: 20, borderRadius: 20, width: (width - 80) / 2, alignItems: 'center' },
  impactCardSuccess: { backgroundColor: '#4CAF5010', padding: 20, borderRadius: 20, width: (width - 80) / 2, alignItems: 'center' },
  impactCardAccent: { backgroundColor: '#FFB80010', padding: 20, borderRadius: 20, width: (width - 80) / 2, alignItems: 'center' },
  impactCardPink: { backgroundColor: '#44cdff10', padding: 20, borderRadius: 20, width: (width - 80) / 2, alignItems: 'center' },
  impactNum: { fontSize: 36, fontWeight: 'bold', color: '#FF6B6B' },
  impactNumGreen: { fontSize: 36, fontWeight: 'bold', color: '#4CAF50' },
  impactNumYellow: { fontSize: 36, fontWeight: 'bold', color: '#FFB800' },
  impactNumPink: { fontSize: 36, fontWeight: 'bold', color: '#57AFDB' },
  impactLabel: { marginTop: 8, color: '#666' },

  ctaSection: { padding: 30, backgroundColor: '#57AFDB', alignItems: 'center' },
  ctaTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  ctaDesc: { color: '#ffe0e0', textAlign: 'center', marginVertical: 12, lineHeight: 22 },
  accentButtonLarge: { backgroundColor: '#FFB800', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, marginTop: 10 },
  accentButtonTextLarge: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});