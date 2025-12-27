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

interface AdoptDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  strayName: string;
}

export default function AdoptDrawer({ isVisible, onClose, strayName }: AdoptDrawerProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    reason: '',
    hasExperience: false,
    agreeTerms: false,
  });

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!formData.agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions');
      return;
    }

    // TODO: In real app, send to Supabase (new table: adoption_requests)
    Alert.alert(
      'Success!',
      `Adoption request for ${strayName} submitted!\nWe'll review it and contact you soon.`
    );

    // Reset form and close
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      reason: '',
      hasExperience: false,
      agreeTerms: false,
    });
    onClose();
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
            <Text style={styles.title}>Adopt {strayName} 💚</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Fill out this form to start your adoption journey
          </Text>

          {/* Form - Scrollable */}
          <ScrollView style={styles.formContainer}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />

            {/* Email */}
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="09XX XXX XXXX"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            {/* Address */}
            <Text style={styles.label}>Complete Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your complete address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={3}
            />

            {/* Reason */}
            <Text style={styles.label}>Why do you want to adopt {strayName}?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about yourself and why you'd be a great pet parent..."
              value={formData.reason}
              onChangeText={(text) => setFormData({ ...formData, reason: text })}
              multiline
              numberOfLines={4}
            />

            {/* Checkboxes */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFormData({ ...formData, hasExperience: !formData.hasExperience })}
              >
                <Ionicons
                  name={formData.hasExperience ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={formData.hasExperience ? '#FFB800' : '#888'}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I have previous experience caring for pets</Text>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setFormData({ ...formData, agreeTerms: !formData.agreeTerms })}
              >
                <Ionicons
                  name={formData.agreeTerms ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={formData.agreeTerms ? '#FFB800' : '#888'}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the adoption terms and commit to providing a loving home *
              </Text>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Adoption Request</Text>
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
    maxHeight: 400, // Adjust based on your needs
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 16,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
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