import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [strays, setStrays] = useState([
    {
      id: 1,
      name: 'Charlie',
      image: require('../../assets/strays/charlie.png'),
      gender: 'Male',
      location: 'Engineering Building',
      status: 'Available',
      breed: 'Mixed Breed',
      isFavorited: false,
    },
    {
      id: 2,
      name: 'Bella',
      image: require('../../assets/strays/bella.png'),
      gender: 'Female',
      location: 'Science Complex',
      status: 'Available',
      breed: 'Tabby Cat',
      isFavorited: false,
    },
    {
      id: 3,
      name: 'Rocky',
      image: require('../../assets/strays/rocky.png'),
      gender: 'Male',
      location: 'Library Courtyard',
      status: 'Under Care',
      breed: 'Labrador Mix',
      isFavorited: false,
    },
    {
      id: 4,
      name: 'Mimi',
      image: require('../../assets/strays/mimi.png'),
      gender: 'Female',
      location: 'Student Center',
      status: 'Available',
      breed: 'Persian Mix',
      isFavorited: false,
    },
    {
      id: 5,
      name: 'Duke',
      image: require('../../assets/strays/duke.png'),
      gender: 'Male',
      location: 'Sports Complex',
      status: 'Available',
      breed: 'German Shepherd Mix',
      isFavorited: false,
    },
    {
      id: 6,
      name: 'Luna',
      image: require('../../assets/strays/luna.png'),
      gender: 'Female',
      location: 'Arts Building',
      status: 'Under Care',
      breed: 'Siamese Mix',
      isFavorited: false,
    },
  ]);

  const toggleFavorite = (id) => {
    setStrays(prev =>
      prev.map(stray =>
        stray.id === id ? { ...stray, isFavorited: !stray.isFavorited } : stray
      )
    );
  };

  // Filter strays based on search and filter
  const filteredStrays = strays.filter(stray => {
    const matchesSearch = stray.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stray.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Available' && stray.status === 'Available') ||
      (selectedFilter === 'Under Care' && stray.status === 'Under Care');

    return matchesSearch && matchesFilter;
  });

  const filters = ['All', 'Available', 'Under Care'];

  const renderStray = ({ item }) => (
    <TouchableOpacity
      style={styles.strayCard}
      onPress={() => router.push(`/stray/${item.id}`)}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.strayImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Ionicons
            name={item.isFavorited ? 'heart' : 'heart-outline'}
            size={22}
            color={item.isFavorited ? '#FF4081' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Info */}
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
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meet Our Campus Strays 🐶</Text>
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
                selectedFilter === filter && styles.activeFilter
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stray Grid */}
      <FlatList
        data={filteredStrays}
        renderItem={renderStray}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterRow: {
    marginTop: 16,
    marginBottom: 10,
  },
  filterPill: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilter: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },

  grid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
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
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  strayImage: {
    width: '100%',
    height: '100%',
  },
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
  strayInfo: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  strayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: '#4CAF50',
  },
  underCareBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  breedText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 6,
  },
});