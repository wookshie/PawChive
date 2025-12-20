import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { STRAYS } from '../../constants/strays';

export default function StrayDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);

  // Find the correct stray by id
  const stray = STRAYS.find(s => s.id === Number(id)) || STRAYS[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={stray.image} style={styles.heroImage} resizeMode="cover" />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
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
        <View style={styles.card}>
          <View style={styles.nameHeader}>
            <View>
              <Text style={styles.name}>{stray.name}</Text>
              <Text style={styles.breed}>{stray.breed}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Available</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            {[
              ['Gender', stray.gender],
              ['Age', stray.age],
              ['Weight', stray.weight],
              ['Rescue Date', stray.rescueDate],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={18} color="#FF6B6B" />
            <Text style={styles.locationText}>{stray.location}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About {stray.name}</Text>
          <Text style={styles.bio}>{stray.bio}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.healthHeader}>
            <MaterialIcons name="favorite" size={24} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Health Summary</Text>
          </View>

          {stray.vaccinations.map((v, i) => (
            <View key={i} style={styles.vaccinationItem}>
              <View>
                <Text style={styles.vaxName}>{v.name}</Text>
                <Text style={styles.vaxDate}>{v.date}</Text>
              </View>
              <View
                style={[
                  styles.vaxBadge,
                  v.status === 'Completed' ? styles.completed : styles.scheduled,
                ]}
              >
                <Text style={styles.vaxBadgeText}>{v.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.adoptBtn}>
          <Text style={styles.adoptText}>Adopt {stray.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sponsorBtn}>
          <Text style={styles.sponsorText}>Sponsor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { height: 360, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 30 },
  topActions: { position: 'absolute', top: 50, right: 20, gap: 12 },
  actionBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 30 },
  content: { flex: 1, paddingHorizontal: 20, marginTop: -40 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  nameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { fontSize: 32, fontWeight: 'bold' },
  breed: { fontSize: 16, color: '#666', marginTop: 4 },
  badge: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  infoItem: { width: '45%' },
  infoLabel: { fontSize: 12, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  locationText: { marginLeft: 8, fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  bio: { fontSize: 15, lineHeight: 22, color: '#444' },
  healthHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  vaccinationItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 14, borderRadius: 12, marginBottom: 10 },
  vaxName: { fontWeight: '600' },
  vaxDate: { fontSize: 12, color: '#666', marginTop: 4 },
  vaxBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  completed: { backgroundColor: '#4CAF50' },
  scheduled: { backgroundColor: '#FF9800' },
  vaxBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomActions: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', gap: 12 },
  adoptBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 30, alignItems: 'center' },
  adoptText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sponsorBtn: { backgroundColor: '#FFB800', padding: 16, borderRadius: 30, alignItems: 'center' },
  sponsorText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});