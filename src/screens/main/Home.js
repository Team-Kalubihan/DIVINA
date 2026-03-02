import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/DIVINA logo.svg';

const { width } = Dimensions.get('window');

// ─── Click Handlers ─────────────────────────────────────────────────────
const handleCardPress = () => {
  alert('Card pressed');
}

// ─── MarineConditionCard ─────────────────────────────────────────────────────
const MarineConditionCard = ({ icon, label, value, highlighted }) => (
  <View style={[styles.conditionCard, highlighted && styles.conditionCardHighlighted]}>
    <View style={styles.conditionRow}>
      <Ionicons name={icon} size={16} color={highlighted ? '#fff' : '#2563EB'} />
      <View style={styles.conditionText}>
        <Text style={[styles.conditionLabel, highlighted && styles.conditionLabelHighlighted]}>
          {label}
        </Text>
        <Text style={[styles.conditionValue, highlighted && styles.conditionValueHighlighted]}>
          {value}
        </Text>
      </View>
    </View>
  </View>
);

// ─── MarineConditionsSection ─────────────────────────────────────────────────
const MarineConditionsSection = () => (
  <View style={styles.marineSection}>
    <Logo width={150} height={30} />
    <Text style={styles.marineSectionTitle}>Current Marine Conditions:</Text>
    <View style={styles.conditionsGrid}>
      <MarineConditionCard icon="eye"         label="Visibility"     value="10m – 20m" highlighted />
      <MarineConditionCard icon="water"       label="Tide"           value="1.5m"      highlighted />
      <MarineConditionCard icon="thermometer" label="Temperature"    value="28°C"      />
      <MarineConditionCard icon="shield"      label="Diving Status"  value="Safe"      />
    </View>
  </View>
);

// ─── BookedAreaBanner ────────────────────────────────────────────────────────
const BookedAreaBanner = ({ area }) => (
  <TouchableOpacity style={styles.bookedBanner} activeOpacity={0.8}>
    <View>
      <Text style={styles.bookedLabel}>Booked area:</Text>
      <Text style={styles.bookedArea}>{area}</Text>
    </View>
    <Ionicons name="arrow-forward" size={18} color="#1E40AF" />
  </TouchableOpacity>
);

// ─── SiteCard ────────────────────────────────────────────────────────────────
const SiteCard = ({ name, imageUri }) => (
  <TouchableOpacity style={styles.siteCard} activeOpacity={0.85} onPress={handleCardPress}>
    <ImageBackground
      source={{ uri: imageUri }}
      style={styles.siteImage}
      imageStyle={styles.siteImageStyle}
    >
      <View style={styles.siteImageOverlay} />
    </ImageBackground>
    <View style={styles.siteNameContainer}>
      <Text style={styles.siteName}>{name}</Text>
    </View>
  </TouchableOpacity>
);

// ─── SiteSection ─────────────────────────────────────────────────────────────
const SiteSection = ({ title, sites }) => (
  <View style={styles.siteSection}>
    <Text style={styles.siteSectionTitle}>{title}</Text>
    {sites.map((site) => (
      <SiteCard key={site.name} name={site.name} imageUri={site.imageUri} />
    ))}
  </View>
);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const POPULAR_SITES = [
  {
    name: 'Pescador Island',
    imageUri: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80',
  },
  {
    name: 'Moalboal',
    imageUri: 'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=600&q=80',
  },
  {
    name: 'Olanggo Island',
    imageUri: 'https://i0.wp.com/theficklefeet.com/wp-content/uploads/2025/09/San-Vicente-Marine-Sanctuary-Olango-Island-1-Large.jpeg?w=1280&ssl=1',
  },
];

const HIDDEN_SITES = [
  {
    name: 'Pescador Island',
    imageUri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
  {
    name: 'Moalboal',
    imageUri: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
  },
  {
    name: 'Olanggo Island',
    imageUri: 'https://i0.wp.com/theficklefeet.com/wp-content/uploads/2025/09/San-Vicente-Marine-Sanctuary-Olango-Island-1-Large.jpeg?w=1280&ssl=1',
  },
];

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = () => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Marine Conditions Card */}
        <View style={styles.marineCard}>
          <MarineConditionsSection />
          <BookedAreaBanner area="Malapascua" />
        </View>

        {/* Popular Sites */}
        <SiteSection title="Popular sites" sites={POPULAR_SITES} />

        {/* Hidden Sites */}
        <SiteSection title="Explore hidden sites" sites={HIDDEN_SITES} />

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE_PRIMARY = '#2563EB';
const BLUE_CARD    = '#3B82F6';
const BLUE_LIGHT   = '#EFF6FF';
const BG           = '#F0F4FF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Marine Card
  marineCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  marineSection: {
    borderRadius: 30,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 20,
  },
  marineSectionTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 12,
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  conditionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: (width - 32 - 32 - 10) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  conditionCardHighlighted: {
    backgroundColor: BLUE_CARD,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conditionText: {
    flex: 1,
  },
  conditionLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  conditionLabelHighlighted: {
    color: 'rgba(255,255,255,0.75)',
  },
  conditionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  conditionValueHighlighted: {
    color: '#fff',
  },

  // ── Booked Banner
  bookedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  bookedLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  bookedArea: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  // ── Site Sections
  siteSection: {
    marginBottom: 20,
  },
  siteSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 0.2,
  },

  // ── Site Cards
  siteCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    height: 90,
    backgroundColor: '#CBD5E1',
    flexDirection: 'row',
  },
  siteImage: {
    width: 130,
    height: 90,
  },
  siteImageStyle: {
    borderRadius: 0,
  },
  siteImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,30,80,0.15)',
  },
  siteNameContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
  },
  siteName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
  },
});

export default HomeScreen;