import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/utils/supabase';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Editable profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Mock stats & activity
  const stats = [
    { label: 'Strays Helped', value: '12', color: '#F44336', icon: 'heart' },
    { label: 'Adoptions', value: '3', color: '#4CAF50', icon: 'checkmark-circle' },
    { label: 'Sponsorships', value: '5', color: '#FFB800', icon: 'calendar' },
  ];

  const activityHistory = [
    { action: 'Adopted Charlie', date: 'Dec 15, 2024', icon: 'home', color: '#4CAF50' },
    { action: 'Sponsored Bella', date: 'Nov 22, 2024', icon: 'heart', color: '#FF4081' },
    { action: 'Volunteered at health camp', date: 'Oct 10, 2024', icon: 'medical', color: '#2196F3' },
    { action: 'Donated pet food', date: 'Sept 5, 2024', icon: 'fast-food', color: '#FF9800' },
  ];

  // Future: Load user data from Supabase session on mount
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name || session.user.email.split('@')[0]);
        setEmail(session.user.email || '');
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const saveProfile = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match!");
      return;
    }

    // Future: Update user profile via Supabase
    Alert.alert('Success', 'Profile updated successfully!');
    setEditModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLogoutLoading(true);
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;

              setUser(null);
              router.replace('/(auth)/landing');
            } catch (err) {
              Alert.alert('Logout Failed', err.message || 'Something went wrong');
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#57AFDB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👤 Profile</Text>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{name}</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="create-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={16} color="#888" />
              <Text style={styles.email}>{email}</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Student Volunteer</Text>
            </View>

            <View style={styles.memberRow}>
              <Ionicons name="calendar-outline" size={16} color="#888" />
              <Text style={styles.memberSince}>Member since Jan 2024</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={stat.icon} size={32} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          {activityHistory.map((act, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: act.color + '20' }]}>
                <Ionicons name={act.icon} size={24} color={act.color} />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.activityAction}>{act.action}</Text>
                <Text style={styles.activityDate}>{act.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setEditModalVisible(true)}
          >
            <Ionicons name="person-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="settings-outline" size={24} color="#333" />
            <Text style={styles.settingText}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutItem}
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <ActivityIndicator size="small" color="#F44336" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={24} color="#F44336" />
                <Text style={styles.logoutText}>Logout</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="New Password (optional)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 50,
  },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },

  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: { alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FF6B6B30',
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  userInfo: { alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  editBtn: { padding: 8 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  email: { fontSize: 15, color: '#666' },
  badge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  badgeText: { fontSize: 13, color: '#666', fontWeight: '600' },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberSince: { fontSize: 14, color: '#888' },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333', marginVertical: 8 },
  statLabel: { fontSize: 12, color: '#666' },

  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  activityTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityText: { flex: 1 },
  activityAction: { fontSize: 15, fontWeight: '600', color: '#333' },
  activityDate: { fontSize: 13, color: '#888', marginTop: 4 },

  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingText: { fontSize: 16, color: '#333', marginLeft: 16, flex: 1 },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: { fontSize: 16, color: '#F44336', marginLeft: 16, flex: 1, fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 12 },
  cancelText: { color: '#666', fontSize: 16 },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});