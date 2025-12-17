import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Admin Team',
      role: 'System',
      lastMessage: 'Your adoption request for Charlie has been approved!',
      time: '2 hours ago',
      unread: 2,
      isAdmin: true,
    },
    {
      id: 2,
      name: 'Campus Volunteer',
      role: 'Moderator',
      lastMessage: 'Thank you for sponsoring Bella! She\'s doing great.',
      time: '5 hours ago',
      unread: 0,
      isAdmin: true,
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'User',
      lastMessage: 'Is Rocky still available for adoption?',
      time: '1 day ago',
      unread: 1,
      isAdmin: false,
    },
  ];

  const currentMessages = [
    {
      id: 1,
      sender: 'Admin Team',
      message: 'Hello! Your adoption request for Charlie has been received.',
      time: '10:30 AM',
      isAdmin: true,
    },
    {
      id: 2,
      sender: 'You',
      message: 'Great! When can I complete the adoption process?',
      time: '10:35 AM',
      isAdmin: false,
    },
    {
      id: 3,
      sender: 'Admin Team',
      message: 'Your adoption request for Charlie has been approved! Please visit the campus office to complete the paperwork.',
      time: '11:00 AM',
      isAdmin: true,
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In real app: send message to backend
      setMessageInput('');
    }
  };

  // Chat Detail View
  if (selectedChat !== null) {
    const conversation = conversations.find(c => c.id === selectedChat);

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.headerAvatar}>
              <Text style={styles.avatarText}>
                {conversation?.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{conversation?.name}</Text>
              <Text style={styles.headerRole}>{conversation?.role}</Text>
            </View>

            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Messages List */}
          <ScrollView style={styles.messagesContainer} contentContainerStyle={{ padding: 16 }}>
            {currentMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.sender === 'You' ? styles.sentWrapper : styles.receivedWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === 'You'
                      ? styles.sentBubble
                      : msg.isAdmin
                      ? styles.adminBubble
                      : styles.receivedBubble,
                  ]}
                >
                  {msg.isAdmin && msg.sender !== 'You' && (
                    <Text style={styles.adminSender}>{msg.sender}</Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      msg.sender === 'You' ? styles.sentText : styles.receivedText,
                    ]}
                  >
                    {msg.message}
                  </Text>
                  <Text style={styles.messageTime}>{msg.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={messageInput}
              onChangeText={setMessageInput}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageInput.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Conversations List View
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.pageTitle}>Messages</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <ScrollView style={styles.conversationsList}>
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationCard}
            onPress={() => setSelectedChat(conv.id)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {conv.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              {conv.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>✓</Text>
                </View>
              )}
            </View>

            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <View style={styles.nameRow}>
                  <Text style={styles.conversationName}>{conv.name}</Text>
                  {conv.isAdmin && (
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{conv.role}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timeText}>{conv.time}</Text>
              </View>

              <View style={styles.lastMessageRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
                {conv.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Conversations List
  listHeader: { padding: 20, paddingTop: 10, backgroundColor: '#fff' },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 30, paddingHorizontal: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 16 },

  conversationsList: { flex: 1, paddingHorizontal: 20 },
  conversationCard: { flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: '#FFB800',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  adminBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  conversationInfo: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  conversationName: { fontSize: 16, fontWeight: 'bold' },
  roleBadge: { backgroundColor: '#e0e0e0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  roleText: { fontSize: 11, color: '#666' },
  timeText: { fontSize: 12, color: '#888' },

  lastMessageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#666', flex: 1, marginRight: 8 },
  unreadBadge: { backgroundColor: '#FF6B6B', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  unreadCount: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Chat Detail
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 18, fontWeight: 'bold' },
  headerRole: { fontSize: 13, color: '#888' },

  messagesContainer: { flex: 1 },
  messageWrapper: { marginVertical: 8 },
  sentWrapper: { alignItems: 'flex-end' },
  receivedWrapper: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
  sentBubble: { backgroundColor: '#FF6B6B', borderBottomRightRadius: 4 },
  adminBubble: { backgroundColor: '#FFB800', borderBottomLeftRadius: 4 },
  receivedBubble: { backgroundColor: '#f0f0f0', borderBottomLeftRadius: 4 },
  adminSender: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  messageText: { fontSize: 15 },
  sentText: { color: '#fff' },
  receivedText: { color: '#333' },
  messageTime: { fontSize: 11, opacity: 0.7, marginTop: 4, alignSelf: 'flex-end' },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#ccc' },
});