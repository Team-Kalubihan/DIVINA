import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── DemandBadge ─────────────────────────────────────────────────────────────
const DemandBadge = ({ level }) => {
  const config = {
    high:   { label: 'High demand', bg: '#FEF9C3', text: '#854D0E' },
    medium: { label: 'Med demand',  bg: '#DBEAFE', text: '#1E40AF' },
    low:    { label: 'Low demand',  bg: '#DCFCE7', text: '#166534' },
  };
  const { label, bg, text } = config[level] || config.high;
  return (
    <View style={[styles.demandBadge, { backgroundColor: bg }]}>
      <Text style={[styles.demandText, { color: text }]}>{label}</Text>
    </View>
  );
};

// ─── StatusTag ────────────────────────────────────────────────────────────────
const StatusTag = ({ type }) => {
  const config = {
    open:         { label: '✓ open',       bg: '#DCFCE7', text: '#166534' },
    closed:       { label: '✕ closed',     bg: '#FEE2E2', text: '#991B1B' },
    'high traffic': { label: 'high traffic', bg: '#FEE2E2', text: '#991B1B' },
    'low traffic':  { label: 'low traffic',  bg: '#DCFCE7', text: '#166534' },
    'med traffic':  { label: 'med traffic',  bg: '#FEF9C3', text: '#854D0E' },
  };
  const { label, bg, text } = config[type] || { label: type, bg: '#F1F5F9', text: '#475569' };
  return (
    <View style={[styles.statusTag, { backgroundColor: bg }]}>
      <Text style={[styles.statusTagText, { color: text }]}>{label}</Text>
    </View>
  );
};

// ─── DiveSiteCard ─────────────────────────────────────────────────────────────
/**
 * Props:
 *  - name        {string}   e.g. "Bulak Point"
 *  - demand      {string}   "high" | "medium" | "low"
 *  - price       {string}   e.g. "P340"
 *  - location    {string}   e.g. "Moalboal, Cebu"
 *  - slots       {number}   e.g. 5
 *  - divePeriod  {string}   e.g. "Today's dive"
 *  - tags        {string[]} e.g. ["open", "high traffic"]
 *  - imageUri    {string}   image URL or local require()
 *  - onViewDetails {function}
 */
const DiveSiteCard = ({
  name        = 'Bulak Point',
  demand      = 'high',
  price       = 'P340',
  location    = 'Moalboal, Cebu',
  slots       = 5,
  divePeriod  = "Today's dive",
  tags        = ['open', 'high traffic'],
  imageUri    = 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80',
  onViewDetails = () => {},
}) => (
  <View style={styles.card}>
    {/* Thumbnail */}
    <Image source={{ uri: imageUri }} style={styles.image} />

    {/* Content */}
    <View style={styles.content}>
      {/* Row 1 – Name + Demand + Price */}
      <View style={styles.topRow}>
        <Text style={styles.name}>{name}</Text>
        
        <View style={styles.priceBlock}>
          <Text style={styles.priceFrom}>from </Text>
          <Text style={styles.priceValue}>{price}</Text>
        </View>
      </View>

      {/* Row 2 – Location */}
      <View style={styles.locationRow}>
        <DemandBadge level={demand} />
        <Ionicons name="location-outline" size={13} color="#64748B" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* Row 3 – Slots + Period */}
      <Text style={styles.slotsText}>
        {slots} slots open | {divePeriod}
      </Text>

      {/* Row 4 – Tags + Button */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.viewButton} onPress={onViewDetails} activeOpacity={0.85}>
          <Text style={styles.viewButtonText}>View details</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },

  // ── Image
  image: {
    width: 100,
    height: '100%',
    minHeight: 120,
  },

  // ── Content
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 4,
  },

  // ── Top Row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 'auto',
  },
  priceFrom: {
    fontSize: 11,
    color: '#64748B',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },

  // ── Demand Badge
  demandBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  demandText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },

  // ── Slots
  slotsText: {
    fontSize: 12,
    color: '#475569',
  },

  // ── Bottom Row
  bottomRow: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  // ── Status Tags
  statusTag: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── View Trips Button
  viewButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default DiveSiteCard;