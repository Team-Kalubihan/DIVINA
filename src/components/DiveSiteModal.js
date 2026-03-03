import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import TripsModal from './TripsModal';

const { width } = Dimensions.get('window');

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const DIVE_SITE_MODAL_MOCK = {
  name: 'Moalboal',
  latitude: 9.9383,
  longitude: 123.4006,
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at purus ornare, facilisis ipsum a, dignissim mauris. Nulla varius at augue a congue. Etiam et malesuada nisi. Sed cursus velit et lacinia molestie. Nulla ac sapien et malesuada nisiet malesu...',
  images: [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&q=80',
    'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=400&q=80',
  ],
  trips: [
    {
      id: 't1',
      name: 'Morning Dive',
      location: 'Tindahan Reef',
      slotsFilled: 5,
      totalSlots: 8,
      boat: 'Boat A',
      confirmedCount: 3,
      status: 'confirmed',   // 'confirmed' | 'needs_more'
      statusLabel: 'Confirmed trip',
    },
    {
      id: 't2',
      name: 'Afternoon Dive',
      location: 'Nearby reef',
      slotsFilled: 2,
      totalSlots: 8,
      boat: 'Boat A',
      confirmedCount: null,
      status: 'needs_more',
      statusLabel: 'Needs 2 more to confirm',
    },
  ],
};

const MOCK_REVIEWS = [
  {
    reviewer: 'Alice',
    rating: 5,
    comment: 'Amazing dive site with vibrant marine life! The guides were knowledgeable and friendly.',
  },
  {
    reviewer: 'Bob',
    rating: 4,
    comment: 'Great visibility and beautiful coral formations. Would love to come back!',
  },
  {
    reviewer: 'Charlie',
    rating: 5,
    comment: 'One of the best dives I’ve ever had! Saw turtles, sharks, and a huge variety of fish.',
  },
  {
    reviewer: 'Diana',
    rating: 4,
    comment: 'Beautiful site with lots to see. The currents were a bit strong, but overall a fantastic experience.',
  },
];

// ─── PhotoGrid ────────────────────────────────────────────────────────────────
const PhotoGrid = ({ images = [] }) => {
  const [img1, img2, img3, img4] = images;
  return (
    <View style={styles.photoGrid}>
      {/* Left – large */}
      <Image source={{ uri: img1 }} style={styles.photoLarge} />
      {/* Right – 2 stacked */}
      <View style={styles.photoRightCol}>
        <Image source={{ uri: img2 }} style={styles.photoSmall} />
        <Image source={{ uri: img3 }} style={styles.photoSmall} />
      </View>
      {/* Far right – tall */}
      <Image source={{ uri: img4 }} style={styles.photoTall} />
    </View>
  );
};

// ─── Reviews Header ─────────────────────────────────────────────────────────
const ReviewsHeader = ({ rating, count }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
    <Ionicons name="star" size={32} color="#FBBF24" />
    <Text style={{ fontSize: 20, fontWeight: '600', color: '#1E293B' }}>
      {rating} ({count} reviews)
    </Text>
   </View>
);

// ─── Reviews Card ───────────────────────────────────────────────────────────
const ReviewCard = ({ reviewer, rating, comment }) => (
  <View style={{ backgroundColor: '#F8FAFF', borderRadius: 12, padding: 12, marginBottom: 10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <Ionicons name="person-circle" size={24} color="#64748B" />
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1E293B' }}>{reviewer}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
        <Ionicons name="star" size={14} color="#FBBF24" />
        <Text style={{ fontSize: 12, color: '#475569' }}>{rating}</Text>
      </View>
    </View>
    <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18 }}>{comment}</Text>
  </View>
);

// ─── Reviews Container ─────────────────────────────────────────────────────────────────
const ReviewsSection = ({ reviews }) => (
  <View style={{ marginTop: 16 }}>
    <Text style={{ fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 12 }}>
      Reviews
    </Text>
    {reviews.map((rev, idx) => (
      <ReviewCard key={idx} reviewer={rev.reviewer} rating={rev.rating} comment={rev.comment} />
    ))}
   </View>
);

// ─── DiveSiteModal ────────────────────────────────────────────────────────────
/**
 * Props:
 *  - visible   {boolean}
 *  - onClose   {function}
 *  - data      {object}   — shape matches DIVE_SITE_MODAL_MOCK
 *  - onDirections {function}
 *  - onJoinTrip  {function}
 */
const DiveSiteModal = ({
  visible      = false,
  onClose      = () => {},
  onDirections = () => {},
  onJoinTrip   = () => {},
  data         = DIVE_SITE_MODAL_MOCK,
}) => {

  const [modalVisible, setModalVisible] = useState(false);  

  // ── Directions handler ──────────────────────────────────────────────────
  const handleDirections = async () => {
    const { latitude, longitude, name } = data;

    if (!latitude || !longitude) {
      Alert.alert('Location Unavailable', 'No coordinates found for this dive site.');
      return;
    }

    const label = encodeURIComponent(name);

    // Google Maps URL — works on both iOS and Android
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_name=${label}&travelmode=driving`;

    // iOS: try native Apple Maps first, fall back to Google Maps
    const appleMapsUrl  = `maps://?daddr=${latitude},${longitude}&q=${label}`;

    try {
      if (Platform.OS === 'ios') {
        const appleSupported = await Linking.canOpenURL(appleMapsUrl);
        if (appleSupported) {
          await Linking.openURL(appleMapsUrl);
          return;
        }
      }
      // Android or Apple Maps not available — open Google Maps in browser
      const googleSupported = await Linking.canOpenURL(googleMapsUrl);
      if (googleSupported) {
        await Linking.openURL(googleMapsUrl);
      } else {
        Alert.alert('Error', 'Unable to open maps on this device.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong opening maps.');
      console.error(error);
    }
  };
  // ───────────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{data.name}</Text>
            <TouchableOpacity style={styles.directionsButton} onPress={handleDirections} activeOpacity={0.85}>
              <Text style={styles.directionsText}>Directions</Text>
              <Ionicons name="arrow-forward-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Photo Grid */}
          <PhotoGrid images={data.images} />

          {/* Description */}
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{data.description}</Text>
          </View>

          {/* View trips */}
          <TouchableOpacity style={styles.viewTripsButton} onPress={() => {setModalVisible(true)}} activeOpacity={0.85}>
            <Text style={styles.viewTripsText}>View All Trips</Text>
          </TouchableOpacity>

          {/* Reviews Header */}
          <ReviewsHeader rating={4.8} count={MOCK_REVIEWS.length} />
          <ReviewsSection reviews={MOCK_REVIEWS} />

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Trips Modal */}
        <TripsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onDirections={handleDirections}
          onJoinTrip={onJoinTrip}
          data={data}
        />

      </SafeAreaView>
    </Modal>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 5,
  },
  directionsText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ── Photo Grid
  photoGrid: {
    flexDirection: 'row',
    height: 190,
    gap: 6,
    marginBottom: 14,
  },
  photoLarge: {
    flex: 2.2,
    borderRadius: 14,
    backgroundColor: '#CBD5E1',
  },
  photoRightCol: {
    flex: 1.6,
    gap: 6,
  },
  photoSmall: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
  },
  photoTall: {
    flex: 1.4,
    borderRadius: 14,
    backgroundColor: '#CBD5E1',
  },

  // ── Description
  descriptionBox: {
    backgroundColor: '#F8FAFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  descriptionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },

  // ── View Trips Button
  viewTripsButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: '#A5B4FC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
  },
  viewTripsText: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },

  // ── Trips Section
  tripsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 14,
  },

  // ── Trip Card
  tripCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  tripCardConfirmed: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  tripCardPending: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  tripTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tripTopLeft: {
    flex: 1,
    marginRight: 10,
  },
  tripNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tripNameBlock: {
    flex: 1,
  },
  tripName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 3,
  },
  tripLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tripLocation: {
    fontSize: 12,
    color: '#64748B',
  },

  // ── Join Button
  joinButton: {
    backgroundColor: BLUE,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  joinButtonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BLUE,
    shadowOpacity: 0,
    elevation: 0,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  joinButtonTextOutline: {
    color: BLUE,
  },

  // ── Trip Divider
  tripDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginBottom: 10,
  },

  // ── Trip Meta
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  boatIcon: {
    fontSize: 13,
  },
  metaSep: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 2,
  },

  // ── Status Chip
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statusIcon: {
    fontSize: 13,
  },
  statusConfirmed: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  statusPending: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
});

export default DiveSiteModal;