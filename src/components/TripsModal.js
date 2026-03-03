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
  PanResponder,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import BookingDialog, {BOOKING_DIALOG_MOCK} from './BookingConfirmationDialog';

const { width } = Dimensions.get('window');

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const DIVE_SITE_MODAL_MOCK = {
  name: 'Moalboal',
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

// ─── TripStatusChip ───────────────────────────────────────────────────────────
const TripStatusChip = ({ status, label, count }) => {
  if (status === 'confirmed') {
    return (
      <View style={styles.statusRow}>
        <Text style={styles.statusIcon}>🌲</Text>
        <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
        <Text style={styles.statusConfirmed}> {count}  {label}</Text>
      </View>
    );
  }
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusIcon}>⏳</Text>
      <Text style={styles.statusPending}>{label}</Text>
    </View>
  );
};
// ─── TripCard ─────────────────────────────────────────────────────────────────
const TripCard = ({ trip, setDialogVisible }) => {

  const isConfirmed = trip.status === 'confirmed';
  return (
    <View style={[styles.tripCard, isConfirmed ? styles.tripCardConfirmed : styles.tripCardPending]}>
      {/* Top section */}
      <View style={styles.tripTop}>
        <View style={styles.tripTopLeft}>
          <View style={styles.tripNameRow}>
            <Ionicons name="time-outline" size={16} color="#475569" />
            <View style={styles.tripNameBlock}>
              <Text style={styles.tripName}>{trip.name}</Text>
              <View style={styles.tripLocationRow}>
                <Ionicons name="location-outline" size={12} color="#64748B" />
                <Text style={styles.tripLocation}>{trip.location}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.joinButton, !isConfirmed && styles.joinButtonOutline]}
          onPress={() => setDialogVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={[styles.joinButtonText, !isConfirmed && styles.joinButtonTextOutline]}>
            Join Group
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.tripDivider} />

      {/* Bottom meta */}
      <View style={styles.tripMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color="#475569" />
          <Text style={styles.metaText}>{trip.slotsFilled}/{trip.totalSlots} slots filled</Text>
        </View>
        <View style={styles.metaSep} />
        <View style={styles.metaItem}>
          <Text style={styles.boatIcon}>⛵</Text>
          <Text style={styles.metaText}>{trip.boat}</Text>
        </View>
        <View style={styles.metaSep} />
        <TripStatusChip
          status={trip.status}
          label={trip.statusLabel}
          count={trip.confirmedCount}
        />
      </View>
    </View>
  );
};

// ─── DiveSiteModal ────────────────────────────────────────────────────────────
/**
 * Props:
 *  - visible   {boolean}
 *  - onClose   {function}
 *  - data      {object}   — shape matches DIVE_SITE_MODAL_MOCK
 *  - onDirections {function}
 *  - onJoinTrip  {function}
 */
const TripsModal = ({
  visible      = false,
  onClose      = () => {},
  onDirections = () => {},
  onJoinTrip   = () => {},
  data         = DIVE_SITE_MODAL_MOCK,
}) => {

  const [dialogVisible, setDialogVisible] = useState(false);

  const translateY = useState(new Animated.Value(0))[0];

  const panResponder = PanResponder.create({
    // Only capture downward vertical drags on the drag handle
    onMoveShouldSetPanResponder: (_, gestureState) =>
      gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),

    onPanResponderMove: (_, gestureState) => {
      // Only allow dragging downward
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },

    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 120 || gestureState.vy > 0.8) {
        // Threshold reached — animate out then close
        Animated.timing(translateY, {
          toValue: 600,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          translateY.setValue(0);
          onClose();
        });
      } else {
        // Snap back
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }).start();
      }
    },
  });

  // Reset position when modal opens
  React.useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible]);


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[{ flex: 1 }, { transform: [{ translateY }] }]}>
        
          {/* Drag handle — attach panResponder here only */}
          <View style={styles.dragHandleArea} {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            // Prevent scroll from conflicting with drag
              scrollEventThrottle={16}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{data.name}</Text>
              <TouchableOpacity style={styles.directionsButton} onPress={onDirections} activeOpacity={0.85}>
                <Text style={styles.directionsText}>Directions</Text>
                <Ionicons name="arrow-forward-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            {/* Available Dive Trips */}
            <Text style={styles.tripsTitle}>Available Dive Trips</Text>
            {data.trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} setDialogVisible={setDialogVisible} />
            ))}

            <View style={{ height: 30 }} />
          </ScrollView>

          {/* Booking Confirmation Dialog */}
          <BookingDialog
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            onBook={(data) => {
              setDialogVisible(false);
              console.log('Booked:', data.tripName);
              // navigate to confirmation, call API, etc.
            }}
            data={BOOKING_DIALOG_MOCK} // or pass real trip data
          />
        </Animated.View>
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
  dragHandleArea: {
    paddingVertical: 14,
    alignItems: 'center',
    // Larger hit area makes it easier to grab
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
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

export default TripsModal;