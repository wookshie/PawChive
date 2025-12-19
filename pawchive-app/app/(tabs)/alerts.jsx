import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function AlertsScreen() {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Adoption Approved!',
      message: 'Your adoption request for Charlie has been approved. Visit the office to complete paperwork.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'info',
      title: 'New Sponsorship Match',
      message: 'Bella is looking for a sponsor. You\'ve been matched based on your preferences!',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Vaccination Due',
      message: 'Rocky\'s next vaccination is scheduled for Dec 20, 2025.',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      type: 'alert',
      title: 'Health Alert',
      message: 'Luna needs immediate medical attention. Please contact the campus vet.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 5,
      type: 'info',
      title: 'New Stray Rescued',
      message: 'A new stray has been rescued near the Science Building. Check their profile!',
      time: '3 days ago',
      unread: false,
    },
    {
      id: 6,
      type: 'success',
      title: 'Sponsorship Activated',
      message: 'Your monthly sponsorship for Bella has been activated. Thank you!',
      time: '5 days ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIconAndColor = (type) => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#4CAF50' };
      case 'alert':
        return { icon: 'warning', color: '#F44336' };
      case 'reminder':
        return { icon: 'calendar', color: '#FFB800' };
      default:
        return { icon: 'information-circle', color: '#2196F3' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.list}>
        {notifications.map((notif) => {
          const { icon, color } = getIconAndColor(notif.type);

          return (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.card,
                notif.unread && styles.unreadCard,
              ]}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={28} color={color} />
              </View>

              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {notif.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message}>{notif.message}</Text>
                <Text style={styles.time}>{notif.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Empty State */}
      {notifications.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-off" size={60} color="#aaa" />
          </View>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyMessage}>
            You're all caught up! Check back later for updates.
          </Text>
        </View>
      )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  markReadBtn: {
    alignSelf: 'flex-start',
  },
  markReadText: {
    color: '#2196F3',
    fontWeight: '600',
  },

  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    backgroundColor: '#2196F310',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});