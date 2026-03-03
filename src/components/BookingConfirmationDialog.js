import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const BOOKING_DIALOG_MOCK = {
  tripName: 'Morning Dive',
  location: 'Moalboal, Cebu',
  guidelines: [
    { id: 'g1', title: 'Guidelines', description: 'Lorem ipsum dolor sit amet, cons fu' },
    { id: 'g2', title: 'Guidelines', description: 'Lorem ipsum dolor sit amet, cons fu' },
    { id: 'g3', title: 'Guidelines', description: 'Lorem ipsum dolor sit amet, cons fu' },
  ],
};

// ─── GuidelineItem ────────────────────────────────────────────────────────────
const GuidelineItem = ({ guideline, checked, onToggle }) => (
  <TouchableOpacity style={styles.guidelineRow} onPress={onToggle} activeOpacity={0.7}>
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checkboxChecked]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
    </TouchableOpacity>
    <View style={styles.guidelineText}>
      <Text style={styles.guidelineTitle}>{guideline.title}</Text>
      <Text style={styles.guidelineDesc}>{guideline.description}</Text>
    </View>
  </TouchableOpacity>
);

// ─── BookingDialog ────────────────────────────────────────────────────────────
/**
 * Props:
 *  - visible   {boolean}
 *  - onClose   {function}
 *  - onBook    {function}  — called when "Book now" is pressed
 *  - data      {object}   — shape matches BOOKING_DIALOG_MOCK
 */
const BookingDialog = ({
  visible  = false,
  onClose  = () => {},
  onBook   = () => {},
  data     = BOOKING_DIALOG_MOCK,
}) => {
  // Track checked state for each guideline
  const initialChecked = Object.fromEntries(data.guidelines.map((g) => [g.id, true]));
  const [checked, setChecked] = useState(initialChecked);

  const toggleItem = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const allChecked = Object.values(checked).every(Boolean);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Dialog — stop tap propagation */}
        <TouchableOpacity style={styles.dialog} activeOpacity={1} onPress={() => {}}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.tripName}>{data.tripName}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color="#64748B" />
                <Text style={styles.locationText}>{data.location}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Guidelines */}
          <View style={styles.guidelinesList}>
            {data.guidelines.map((g) => (
              <GuidelineItem
                key={g.id}
                guideline={g}
                checked={!!checked[g.id]}
                onToggle={() => toggleItem(g.id)}
              />
            ))}
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[styles.bookButton, !allChecked && styles.bookButtonDisabled]}
            onPress={() => allChecked && onBook(data)}
            activeOpacity={0.85}
          >
            <Text style={styles.bookButtonText}>Book now</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // ── Dialog
  dialog: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 10,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerText: { flex: 1, marginRight: 12 },
  tripName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 13,
    color: '#64748B',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Divider
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },

  // ── Guidelines
  guidelinesList: {
    gap: 16,
    marginBottom: 24,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  guidelineText: { flex: 1 },
  guidelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  guidelineDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  // ── Book Button
  bookButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 5,
  },
  bookButtonDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default BookingDialog;