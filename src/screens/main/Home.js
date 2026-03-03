import React, { useState, useEffect } from 'react';
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

import DiveSiteCard from '../../components/DiveSiteCard';
import DiveSiteWeatherModal, { WEATHER_MOCK } from '../../components/DiveSiteWeatherModal';
import DiveSiteModal, { DIVE_SITE_MODAL_MOCK } from '../../components/DiveSiteModal';
import { Weather } from '../../../API';

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
const MarineConditionsSection = ({ site, marine, setWeatherModalVisible }) => (
  <View style={styles.marineSection} >
    <Logo width={150} height={30} />
    <Text style={styles.marineSectionTitle}>Current Marine Conditions (from {site?.name || 'Dive Site'}):</Text>
    <View style={styles.conditionsGrid}>
      <MarineConditionCard icon="eye"         label="Visibility"     value={marine.visibility}    highlighted />
      <MarineConditionCard icon="water"       label="Wave Height"    value={marine.waveHeight}    highlighted />
      <MarineConditionCard icon="thermometer" label="Water Temp"     value={marine.waterTemp}     />
      <MarineConditionCard icon="shield"      label="Diving Status"  value={marine.divingStatus}  />
    </View>
    <TouchableOpacity style={{ marginTop: 12, backgroundColor: '#EFF6FF', padding: 12, borderRadius: 12 }} onPress={() => setWeatherModalVisible(true)}>
      <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center' }}>
        Tap to view detailed report
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── SiteSection ─────────────────────────────────────────────────────────────
const SiteSection = ({ title, description, sites, setModalVisible }) => (
  <View style={styles.siteSection}>
    <Text style={styles.siteSectionTitle}>{title}</Text>
    <Text style={styles.siteSectionDescription}>{description}</Text>
    {sites.map((site) => (
      <DiveSiteCard
        key={site.id}
        name={site.name}
        demand={site.demand}
        price={site.price}
        location={site.location}
        slots={site.slots}
        divePeriod={site.divePeriod}
        tags={site.tags}
        imageUri={site.imageUri}
        onViewDetails={() => setModalVisible(true)}
        onOpenDetails={() => {
          setSelectedSite(site);
          setModalVisible(true);
        }}
      />
    ))}
  </View>
);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const POPULAR_SITES = [
  {
    id: '1',
    name: 'Bulak Point',
    demand: 'high',
    price: 'P340',
    location: 'Moalboal, Cebu',
    slots: 5,
    divePeriod: "Today's dive",
    tags: ['open', 'high traffic'],
    imageUri: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80',
  },
  {
    id: '2',
    name: 'Pescador Island',
    demand: 'medium',
    price: 'P580',
    location: 'Moalboal, Cebu',
    slots: 8,
    divePeriod: "Tomorrow's dive",
    tags: ['open', 'low traffic'],
    imageUri: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=80',
  },
  {
    id: '3',
    name: 'Olango Island',
    demand: 'low',
    price: 'P420',
    location: 'Lapu-Lapu, Cebu',
    slots: 2,
    divePeriod: "Today's dive",
    tags: ['open', 'med traffic'],
    imageUri: 'https://i0.wp.com/theficklefeet.com/wp-content/uploads/2025/09/San-Vicente-Marine-Sanctuary-Olango-Island-1-Large.jpeg?w=1280&ssl=1',
  },
];

const HIDDEN_SITES = [
  {
    id: '4',
    name: 'Bulak Point',
    demand: 'high',
    price: 'P340',
    location: 'Moalboal, Cebu',
    slots: 5,
    divePeriod: "Today's dive",
    tags: ['open', 'high traffic'],
    imageUri: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&q=80',
  },
  {
    id: '5',
    name: 'Pescador Island',
    demand: 'medium',
    price: 'P580',
    location: 'Moalboal, Cebu',
    slots: 8,
    divePeriod: "Tomorrow's dive",
    tags: ['open', 'low traffic'],
    imageUri: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=300&q=80',
  },
  {
    id: '6',
    name: 'Olango Island',
    demand: 'low',
    price: 'P420',
    location: 'Lapu-Lapu, Cebu',
    slots: 2,
    divePeriod: "Today's dive",
    tags: ['open', 'med traffic'],
    imageUri: 'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=300&q=80',
  },
];

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = () => {

  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

  const [marine, setMarine] = useState({
    visibility: '—',
    waveHeight: '—',
    waterTemp: '—',
    divingStatus: '—',
  });
  const [weatherData, setWeatherData] = useState(WEATHER_MOCK);

  useEffect(() => {
    (async () => {
      try {
        const data = await Weather.marine('Cebu', 1, 'yes');
        const hour = data.forecast?.forecastday?.[0]?.hour?.[0];
        const tides = data.forecast?.forecastday?.[0]?.day?.tides?.[0]?.tide;
        if (hour) {
          const waveHt = hour.sig_ht_mt;
          setMarine({
            visibility: `${hour.vis_km || 10}km`,
            waveHeight: `${waveHt}m`,
            waterTemp: `${hour.water_temp_c}°C`,
            divingStatus: waveHt <= 1.0 ? 'Safe' : waveHt <= 2.0 ? 'Caution' : 'Unsafe',
          });
        }
        setWeatherData(data);
      } catch {
        // keep defaults
      }
    })();
  }, []);

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
          <MarineConditionsSection site={{ name: "Malapascua" }} marine={marine} setWeatherModalVisible={setWeatherModalVisible} />
        </View>

        {/* Hidden Sites */}
        <SiteSection title="Explore hidden sites" description="Help local communities by booking a dive at these hiddle gems." sites={HIDDEN_SITES} setModalVisible={setModalVisible} />

        {/* Popular Sites */}
        <SiteSection title="Popular sites" description="Explore the most visited marine sites in the area." sites={POPULAR_SITES} setModalVisible={setModalVisible} />

      </ScrollView>

      <DiveSiteWeatherModal
        visible={weatherModalVisible}
        onClose={() => setWeatherModalVisible(false)}
        onPrev={() => alert("next site pressed")}
        onNext={() => alert("next site pressed")}
        weatherData={weatherData} />

      {/* Dive Site Modal (for detailed view) */}
      <DiveSiteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDirections={() => {}}
        onJoinTrip={(trip) => console.log('Joining', trip.name)}
        data={DIVE_SITE_MODAL_MOCK}
      />

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
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
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
  siteSectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  siteSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
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