import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [strays, setStrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch strays from Supabase + real-time subscription
  useEffect(() => {
    const fetchStrays = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('strays')
          .select('id, name, breed, gender, age, weight, location, status, rescue_date, image_url, vaccinations')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStrays(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching strays:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStrays();

    // Real-time: auto-refresh when admin changes anything (including vaccinations)
    const channel = supabase
      .channel('strays-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'strays' },
        (payload) => {
          console.log('Stray changed!', payload);
          fetchStrays(); // Refresh list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Local filter (search + status)
  const filteredStrays = strays.filter(stray => {
    const matchesSearch =
      stray.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stray.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Available' && stray.status === 'Available') ||
      (selectedFilter === 'Under Care' && stray.status === 'Under Care');

    return matchesSearch && matchesFilter;
  });

  const filters = ['All', 'Available', 'Under Care'];

  // Helper: Vaccination summary for card
  const getVaccinationSummary = (stray) => {
    if (!Array.isArray(stray.vaccinations) || stray.vaccinations.length === 0) {
      return 'None yet';
    }
    const completed = stray.vaccinations.filter(v => v?.status === 'Completed').length;
    return `Completed: ${completed}/${stray.vaccinations.length}`;
  };

  const renderStray = ({ item }) => (
    <TouchableOpacity
      style={styles.strayCard}
      onPress={() => router.push(`/stray/${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url || 'https://via.placeholder.com/300' }}
          style={styles.strayImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.stopPropagation();
            // Favorite toggle logic here if needed
          }}
        >
          <Ionicons name="heart-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.strayInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.strayName}>{item.name}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'Available' ? styles.availableBadge : styles.underCareBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.breedText}>{item.gender} • {item.breed}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#888" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {/* NEW: Vaccination summary */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: '#555', fontWeight: '500' }}>
            {getVaccinationSummary(item)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐶 Meet Our Campus Strays</Text>
        <Text style={styles.subtitle}>Find your new best friend</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                selectedFilter === filter && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading / Error / Empty / List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : filteredStrays.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No matching strays found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStrays}
          renderItem={renderStray}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// Styles (your original + small addition for vaccination text)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f9ff' },
  header: { padding: 20, paddingTop: 10 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  filterRow: { marginTop: 16, marginBottom: 10 },
  filterPill: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilter: { backgroundColor: '#2196F3' },
  filterText: { fontSize: 14, color: '#666', fontWeight: '600' },
  activeFilterText: { color: '#fff' },
  grid: { paddingHorizontal: 12, paddingBottom: 20 },
  gridRow: { justifyContent: 'space-between' },
  strayCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: { aspectRatio: 1, backgroundColor: '#f0f0f0', position: 'relative' },
  strayImage: { width: '100%', height: '100%' },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strayInfo: { padding: 14 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  strayName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  availableBadge: { backgroundColor: '#4CAF50' },
  underCareBadge: { backgroundColor: '#FF9800' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  breedText: { fontSize: 14, color: '#666', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: '#888', marginLeft: 6 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 18, textAlign: 'center' },
});