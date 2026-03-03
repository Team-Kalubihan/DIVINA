import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width - 32;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
export const WEATHER_MOCK = {
  siteName: 'Malapascua',
  siteLabel: 'booked site',
  current: { temp: 29, icon: '⛅' },
  hourly: [
    { time: '2PM',  temp: 29, icon: '⛅' },
    { time: '3PM',  temp: 28, icon: '🌤' },
    { time: '4PM',  temp: 28, icon: '🌤' },
    { time: '5PM',  temp: 29, icon: '⛅' },
    { time: '6PM',  temp: 30, icon: '⛅' },
    { time: '7PM',  temp: 31, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
    { time: '8PM',  temp: 29, icon: '🌙' },
  ],
  windSpeed: '13.4kph NE',
  tide: {
    points: [
      { label: '7:02AM',  value: 2.17, type: 'high' },
      { label: '1:26PM',  value: 0.8,  type: 'low'  },
      { label: '11:16PM', value: 1.5,  type: 'high' },
    ],
  },
  waterCurrent: 'Calm',
  waterTemp: 29,
  visibility: '20m',
};

// ─── WeatherCard ──────────────────────────────────────────────────────────────
const WeatherCard = ({ current, hourly }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Weather</Text>
    <View style={styles.currentWeatherRow}>
      <Text style={styles.nowLabel}>Now</Text>
      <Text style={styles.currentTemp}>{current.temp}°</Text>
      <Text style={styles.currentIcon}>{current.icon}</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.hourlyRow}>
        {hourly.map((h, i) => (
          <View key={i} style={styles.hourlyItem}>
            <Text style={styles.hourlyTemp}>{h.temp}°</Text>
            <Text style={styles.hourlyIcon}>{h.icon}</Text>
            <Text style={styles.hourlyTime}>{h.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

// ─── WindSpeedCard ────────────────────────────────────────────────────────────
const WindSpeedCard = ({ speed }) => (
  <View style={styles.blueCard}>
    <View style={styles.blueCardLeft}>
      <Ionicons name="aperture-outline" size={28} color="#fff" style={styles.blueCardIcon} />
      <Text style={styles.blueCardLabel}>Wind speed</Text>
    </View>
    <Text style={styles.blueCardValue}>{speed}</Text>
    {/* Wave decoration */}
    <View style={styles.waveOverlay} pointerEvents="none">
      <Text style={styles.waveText}>〰〰〰〰〰〰〰〰</Text>
      <Text style={styles.waveText}>〰〰〰〰〰〰〰〰</Text>
    </View>
  </View>
);

// ─── TideChart ────────────────────────────────────────────────────────────────
const TideChart = ({ tide }) => {
  const chartW = MODAL_WIDTH - 32;
  const chartH = 90;
  const pad    = 24;

  // Map tide points to SVG coords
  const pts = tide.points.map((p, i) => ({
    x: pad + (i / (tide.points.length - 1)) * (chartW - pad * 2),
    y: chartH - pad - ((p.value - 0.5) / 1.2) * (chartH - pad * 2),
    ...p,
  }));

  // Smooth bezier path
  const pathD = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const fillD = `${pathD} L ${pts[pts.length - 1].x} ${chartH} L ${pts[0].x} ${chartH} Z`;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Tide 🌊</Text>
      <Svg width={chartW} height={chartH}>
        <Defs>
          <LinearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0"   stopColor="#93C5FD" stopOpacity="0.5" />
            <Stop offset="1"   stopColor="#93C5FD" stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        {/* Fill */}
        <Path d={fillD} fill="url(#tideGrad)" />
        {/* Line */}
        <Path d={pathD} stroke="#3B82F6" strokeWidth="2" fill="none" />
        {/* Points */}
        {pts.map((pt, i) => (
          <React.Fragment key={i}>
            <Circle cx={pt.x} cy={pt.y} r={4} fill="#fff" stroke="#3B82F6" strokeWidth={2} />
            {/* Value label */}
            <Path
              d={`M ${pt.x} ${pt.type === 'high' ? pt.y - 8 : pt.y - 8}`}
              stroke="none"
            />
          </React.Fragment>
        ))}
      </Svg>
      {/* Labels row */}
      <View style={styles.tideLabelRow}>
        {tide.points.map((p, i) => (
          <View key={i} style={styles.tideLabelItem}>
            <Text style={styles.tideValue}>{p.value}</Text>
            <Text style={styles.tideTime}>{p.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── WaterCurrentCard ─────────────────────────────────────────────────────────
const WaterCurrentCard = ({ current }) => (
  <View style={[styles.blueCard, { marginTop: 0 }]}>
    <View style={styles.blueCardLeft}>
      <Ionicons name="water-outline" size={28} color="#fff" style={styles.blueCardIcon} />
      <Text style={styles.blueCardLabel}>Water current</Text>
    </View>
    <Text style={styles.blueCardValue}>{current}</Text>
    <View style={styles.waveOverlay} pointerEvents="none">
      <Text style={styles.waveText}>〰〰〰〰〰〰〰〰</Text>
      <Text style={styles.waveText}>〰〰〰〰〰〰〰〰</Text>
    </View>
  </View>
);

// ─── MetaStatsRow ─────────────────────────────────────────────────────────────
const MetaStatsRow = ({ waterTemp, visibility }) => (
  <View style={styles.metaRow}>
    <View style={styles.metaCard}>
      <Text style={styles.metaIcon}>🌡</Text>
      <Text style={styles.metaLabel}>Water temperature</Text>
      <Text style={styles.metaValue}>{waterTemp}°</Text>
    </View>
    <View style={styles.metaCard}>
      <Ionicons name="eye-outline" size={26} color="#3B82F6" />
      <Text style={styles.metaLabel}>Visibility</Text>
      <Text style={styles.metaValue}>{visibility}</Text>
    </View>
  </View>
);

// ─── BottomBar ────────────────────────────────────────────────────────────────
const BottomBar = ({ siteName, siteLabel, onPrev, onNext }) => (
  <View style={styles.bottomBar}>
    <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
      <Ionicons name="chevron-back" size={22} color="#2563EB" />
    </TouchableOpacity>
    <View style={styles.bottomCenter}>
      <Text style={styles.bottomSiteName}>{siteName}</Text>
      <Text style={styles.bottomSiteLabel}>{siteLabel}</Text>
    </View>
    <TouchableOpacity onPress={onNext} style={styles.navBtn}>
      <Ionicons name="chevron-forward" size={22} color="#2563EB" />
    </TouchableOpacity>
  </View>
);

// ─── DiveSiteWeatherModal ─────────────────────────────────────────────────────
/**
 * Props:
 *  - visible  {boolean}
 *  - onClose  {function}
 *  - data     {object}   — shape matches WEATHER_MOCK
 *  - onPrev   {function}
 *  - onNext   {function}
 */
const DiveSiteWeatherModal = ({
  visible  = false,
  onClose  = () => {},
  onPrev   = () => {},
  onNext   = () => {},
  data     = WEATHER_MOCK,
}) => (
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
        <WeatherCard      current={data.current}             hourly={data.hourly}       />
        <WindSpeedCard    speed={data.windSpeed}                                         />
        <TideChart        tide={data.tide}                                               />
        <WaterCurrentCard current={data.waterCurrent}                                   />
        <MetaStatsRow     waterTemp={data.waterTemp}         visibility={data.visibility}/>
        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomBar
        siteName={data.siteName}
        siteLabel={data.siteLabel}
        onPrev={onPrev}
        onNext={onNext}
      />
    </SafeAreaView>
  </Modal>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },

  // ── Generic Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },

  // ── Weather
  currentWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  nowLabel: {
    fontSize: 13,
    color: '#64748B',
    marginRight: 4,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
  },
  currentIcon: {
    fontSize: 28,
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 4,
  },
  hourlyItem: {
    alignItems: 'center',
    gap: 3,
  },
  hourlyTemp: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  hourlyIcon: {
    fontSize: 22,
  },
  hourlyTime: {
    fontSize: 11,
    color: '#64748B',
  },

  // ── Blue Cards
  blueCard: {
    backgroundColor: BLUE,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minHeight: 72,
    position: 'relative',
  },
  blueCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
  },
  blueCardIcon: {
    opacity: 0.9,
  },
  blueCardLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  blueCardValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    zIndex: 2,
  },
  waveOverlay: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    opacity: 0.18,
    zIndex: 1,
  },
  waveText: {
    fontSize: 18,
    color: '#fff',
    letterSpacing: -2,
    lineHeight: 18,
  },

  // ── Tide Chart
  tideLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  tideLabelItem: {
    alignItems: 'center',
  },
  tideValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  tideTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // ── Meta Stats
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    alignItems: 'flex-start',
    gap: 4,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  metaIcon: {
    fontSize: 26,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
  },

  // ── Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0EAFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCenter: {
    alignItems: 'center',
  },
  bottomSiteName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  bottomSiteLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
});

export default DiveSiteWeatherModal;