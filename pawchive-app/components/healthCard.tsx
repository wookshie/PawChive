import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HealthCardDrawer({ isVisible, onClose, stray }: { isVisible: boolean; onClose: () => void; stray: any }) {
  const completedCount = stray.vaccinations.filter((v: { status: string; }) => v.status === 'Completed').length;
  const totalCount = stray.vaccinations.length;

  const handleDownload = () => {
    Alert.alert('Downloaded', 'The e-Health card has been saved to your device.');
  };

  const handleShare = () => {
    Alert.alert('Shared', 'Link copied to clipboard. You can now share this health card.');
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
      <View style={styles.drawerContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="medical" size={24} color="#2196F3" />
            <Text style={styles.title}>e-Health Card</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Main Health Card */}
          <View style={styles.healthCard}>
            {/* Header Section */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardHeaderSmall}>Pawchive Health Record</Text>
                <Text style={styles.cardHeaderName}>{stray.name}</Text>
                <Text style={styles.cardHeaderBreed}>{stray.breed}</Text>
              </View>
              <Image source={stray.image} style={styles.cardImage} />
            </View>

            {/* Basic Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="male-female" size={20} color="#FF4081" />
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{stray.gender}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={20} color="#2196F3" />
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{stray.age}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="scale" size={20} color="#4CAF50" />
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{stray.weight}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color="#FF9800" />
                <Text style={styles.infoLabel}>Rescued</Text>
                <Text style={styles.infoValue}>{stray.rescueDate}</Text>
              </View>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Vaccination Record */}
            <View style={styles.vaccinationSection}>
              <View style={styles.vaccinationHeader}>
                <Ionicons name="medical" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>Vaccination Record</Text>
                <Text style={styles.badge}>
                  {completedCount}/{totalCount} Complete
                </Text>
              </View>

              {stray.vaccinations.map((vaccination: { status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                <View
                  key={index}
                  style={[
                    styles.vaccinationRow,
                    vaccination.status === 'Completed'
                      ? styles.completedRow
                      : styles.scheduledRow,
                  ]}
                >
                  <View style={styles.vaccinationLeft}>
                    <View style={[
                      styles.statusDot,
                      vaccination.status === 'Completed' ? styles.completedDot : styles.scheduledDot
                    ]} />
                    <View>
                      <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                      <Text style={styles.vaccinationDate}>{vaccination.date}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.statusBadgeText,
                    vaccination.status === 'Completed' ? styles.completedText : styles.scheduledText
                  ]}>
                    {vaccination.status}
                  </Text>
                </View>
              ))}
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={80} color="#888" />
              </View>
              <Text style={styles.qrText}>Scan to verify health records</Text>
              <Text style={styles.qrId}>ID: PAW-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-social" size={20} color="#fff" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    maxHeight: '65%',
  },
  healthCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2196F3',
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardHeader: {
    backgroundColor: '#2196F3',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderSmall: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  cardHeaderName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardHeaderBreed: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  vaccinationSection: {
    paddingHorizontal: 16,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#2196F3',
    color: '#fff',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vaccinationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  completedRow: {
    backgroundColor: '#E8F5E9',
  },
  scheduledRow: {
    backgroundColor: '#FFF3E0',
  },
  vaccinationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedDot: { backgroundColor: '#4CAF50' },
  scheduledDot: { backgroundColor: '#FF9800' },
  vaccinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vaccinationDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  completedText: {
    color: '#4CAF50',
  },
  scheduledText: {
    color: '#FF9800',
  },
  qrSection: {
    alignItems: 'center',
    padding: 20,
  },
  qrPlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  qrText: {
    fontSize: 14,
    color: '#666',
  },
  qrId: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});