import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

interface SponsorDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  strayName: string;
}

const sponsorTiers = [
  {
    id: 'basic',
    name: 'Basic Sponsor',
    amount: 100,
    icon: 'heart-outline',
    color: '#FF4081',
    benefits: ['Monthly update emails', 'Digital thank you card', 'Name on sponsor wall'],
  },
  {
    id: 'gold',
    name: 'Gold Sponsor',
    amount: 500,
    icon: 'sparkles',
    color: '#FFB800',
    benefits: [
      'All Basic benefits',
      'Quarterly visit rights',
      'Exclusive photos & videos',
      'Sponsor certificate',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Sponsor',
    amount: 1000,
    icon: 'crown',
    color: '#9C27B0',
    benefits: [
      'All Gold benefits',
      'Priority adoption rights',
      'Named health card',
      'VIP campus events',
    ],
  },
];

export default function SponsorDrawer({ isVisible, onClose, strayName }: SponsorDrawerProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!sponsorName || !email) {
      Alert.alert('Error', 'Please fill in your name and email');
      return;
    }
    if (!selectedTier && !customAmount) {
      Alert.alert('Error', 'Please select a sponsorship tier or enter a custom amount');
      return;
    }

    const amount = selectedTier
      ? sponsorTiers.find(t => t.id === selectedTier)?.amount
      : Number(customAmount);

    Alert.alert(
      'Thank You!',
      `Your ₱${amount} sponsorship for ${strayName} has been submitted!\nIt will help provide food, shelter, and medical care.`,
      [{ text: 'OK', onPress: () => {
        setSelectedTier(null);
        setCustomAmount('');
        setSponsorName('');
        setEmail('');
        onClose();
      } }]
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      backdropOpacity={0.6}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.drawerContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Sponsor {strayName} 💛</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Your donation helps provide food, shelter, and medical care
          </Text>

          {/* Tiers */}
          <ScrollView style={styles.formContainer}>
            <View style={styles.tiersContainer}>
              {sponsorTiers.map((tier) => (
                <TouchableOpacity
                  key={tier.id}
                  style={[
                    styles.tierCard,
                    selectedTier === tier.id && styles.selectedTier,
                  ]}
                  onPress={() => {
                    setSelectedTier(tier.id);
                    setCustomAmount('');
                  }}
                >
                  <View style={styles.tierHeader}>
                    <Ionicons name={tier.icon as any} size={28} color={tier.color} />
                    <Text style={[styles.tierName, { color: tier.color }]}>
                      {tier.name}
                    </Text>
                    {tier.popular && (
                      <Text style={styles.popularBadge}>Popular</Text>
                    )}
                  </View>

                  <Text style={styles.tierAmount}>₱{tier.amount}/month</Text>

                  <View style={styles.benefitsList}>
                    {tier.benefits.map((benefit, index) => (
                      <Text key={index} style={styles.benefit}>
                        ✓ {benefit}
                      </Text>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount */}
            <Text style={styles.label}>Or enter a custom amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount (₱)"
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setSelectedTier(null);
              }}
              keyboardType="numeric"
            />

            {/* Sponsor Info */}
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={sponsorName}
              onChangeText={setSponsorName}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Complete Sponsorship</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  formContainer: {
    maxHeight: 400,
  },
  tiersContainer: {
    marginBottom: 20,
  },
  tierCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTier: {
    borderColor: '#FFB800',
    backgroundColor: '#FFF8E1',
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  popularBadge: {
    backgroundColor: '#FFB800',
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  tierAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 6,
  },
  benefit: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#FFB800',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
});