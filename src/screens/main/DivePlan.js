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
const handlecardPress = () => {
  alert('Card pressed');
}

// ─── SiteCard ────────────────────────────────────────────────────────────────
const SiteCard = ({ name, timeAndDate, imageUri }) => (
  <TouchableOpacity style={styles.siteCard} activeOpacity={0.85} onPress={handlecardPress}>
    <ImageBackground
      source={{ uri: imageUri }}
      style={styles.siteImage}
      imageStyle={styles.siteImageStyle}
    >
      <View style={styles.siteImageOverlay} />
    </ImageBackground>
    <View style={styles.siteNameContainer}>
      <Text style={styles.siteName}>{name}</Text>
      <Text style={styles.siteTimeAndDate}>{timeAndDate}</Text>
    </View>
  </TouchableOpacity>
);

// ─── SiteSection ─────────────────────────────────────────────────────────────
const SiteSection = ({ title, sites }) => (
  <View style={styles.siteSection}>
    <Text style={styles.siteSectionTitle}>{title}</Text>
    {sites.map((site) => (
      <SiteCard key={site.name} name={site.name} timeAndDate={site.timeAndDate} imageUri={site.imageUri} />
    ))}
  </View>
);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const POPULAR_SITES = [
  {
    name: 'Pescador Island',
    timeAndDate: '10:00 AM - 12:00 PM',
    imageUri: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80',
  },
  {
    name: 'Moalboal',
    timeAndDate: '11:00 AM - 01:00 PM',
    imageUri: 'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=600&q=80',
  },
  {
    name: 'Olanggo Island',
    timeAndDate: '01:00 PM - 03:00 PM',
    imageUri: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&q=80',
  },
];

// ─── DIVE PLAN SCREEN ────────────────────────────────────────────────────────
const DivePlanScreen = () => {

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Logo width={120} height={40} style={{ marginBottom: 0 }} />

        <SiteSection title="Your booked sites" sites={POPULAR_SITES} />

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
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

  // ── Site Section
  siteSection: {
    marginBottom: 20,
  },
  siteSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Poppins',
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
    alignItems: 'flex-start',
    paddingHorizontal: 14,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'right',
  },
  siteTimeAndDate: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    textAlign: 'right',
  },
});

export default DivePlanScreen;