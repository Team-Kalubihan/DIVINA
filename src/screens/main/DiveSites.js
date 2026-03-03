import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import DiveSiteModal, { DIVE_SITE_MODAL_MOCK } from '../../components/DiveSiteModal';

const { width, height } = Dimensions.get('window');

// ─── MOCK DIVE SITE MARKERS ──────────────────────────────────────────────────
const DIVE_SITES = [
  { id: '1', name: 'Moalboal',        latitude: 9.9383,  longitude: 123.4006, type: 'popular'  },
  { id: '2', name: 'Malapascua',      latitude: 11.3247, longitude: 124.1127, type: 'popular'  },
  { id: '3', name: 'Olango Island',   latitude: 10.2617, longitude: 124.0494, type: 'hidden'   },
  { id: '4', name: 'Pescador Island', latitude: 9.9228,  longitude: 123.3817, type: 'popular'  },
  { id: '5', name: 'Mactan',          latitude: 10.2956, longitude: 123.9797, type: 'community'},
  { id: '6', name: 'Cordova',         latitude: 10.2567, longitude: 123.9542, type: 'community'},
];

// ─── SearchBar ───────────────────────────────────────────────────────────────
const SearchBar = ({ value, onChangeText, onSearch }) => (
  <View style={styles.searchWrapper}>
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search diving communities and sites..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      <TouchableOpacity onPress={onSearch} style={styles.searchIconBtn}>
        <Ionicons name="search" size={20} color="#2563EB" />
      </TouchableOpacity>
    </View>
  </View>
);

// ─── DiveSiteMarker ──────────────────────────────────────────────────────────
const DiveSiteMarker = ({ site, onPress }) => {
  const color =
    site.type === 'popular'   ? '#2563EB' :
    site.type === 'hidden'    ? '#8B5CF6' : '#10B981';

  return (
    <Marker
      coordinate={{ latitude: site.latitude, longitude: site.longitude }}
      onPress={() => onPress(site)}
    >
      <View style={[styles.markerContainer, { backgroundColor: color }]}>
        <Ionicons name="water" size={12} color="#fff" />
      </View>
      <View style={[styles.markerTail, { borderTopColor: color }]} />
    </Marker>
  );
};

// ─── SiteCallout ─────────────────────────────────────────────────────────────
const SiteCallout = ({ site, onClose, onViewDetails }) => {
  if (!site) return null;

  const typeColor =
    site.type === 'popular'   ? '#2563EB' :
    site.type === 'hidden'    ? '#8B5CF6' : '#10B981';

  const typeLabel =
    site.type === 'popular'   ? 'Popular Site'   :
    site.type === 'hidden'    ? 'Hidden Gem'     : 'Community Dive';

  return (
    <View style={styles.calloutCard}>
      <View style={styles.calloutHeader}>
        <View style={[styles.calloutBadge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.calloutBadgeText, { color: typeColor }]}>{typeLabel}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>
      <Text style={styles.calloutName}>{site.name}</Text>
      <TouchableOpacity style={[styles.calloutBtn, { backgroundColor: typeColor }]} onPress={() => onViewDetails(site)}>
        <Text style={styles.calloutBtnText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── MapLegend ───────────────────────────────────────────────────────────────
const MapLegend = () => (
  <View style={styles.legend}>
    {[
      { color: '#2563EB', label: 'Popular'   },
      { color: '#8B5CF6', label: 'Hidden'    },
      { color: '#10B981', label: 'Community' },
    ].map((item) => (
      <View key={item.label} style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
        <Text style={styles.legendLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);

// ─── LocationFAB ─────────────────────────────────────────────────────────────
const LocationFAB = ({ onPress }) => (
  <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
    <Ionicons name="locate" size={22} color="#2563EB" />
  </TouchableOpacity>
);

// ─── DIVE SITES SCREEN ─────────────────────────────────────────────────
const DiveSitesScreen = () => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const mapRef = useRef(null);

  const INITIAL_REGION = {
    latitude:      10.3157,
    longitude:     123.8854,
    latitudeDelta:  0.8,
    longitudeDelta: 0.5,
  };

  const handleMarkerPress = (site) => setSelectedSite(site);
  const handleCloseCallout = () => setSelectedSite(null);
  const handleViewDetails = (site) => {
    setSelectedSite(null);
    setModalVisible(true);
  }

  const handleLocate = () => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 800);
  };

  const filteredSites = DIVE_SITES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Full-screen Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={handleCloseCallout}
        >
          {filteredSites.map((site) => (
            <DiveSiteMarker key={site.id} site={site} onPress={handleMarkerPress} />
          ))}
        </MapView>

        {/* Search Bar (floating over map) */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => {}}
        />

        {/* Legend */}
        <MapLegend />

        {/* Locate FAB */}
        <LocationFAB onPress={handleLocate} />

        {/* Site Callout */}
        {selectedSite && (
          <SiteCallout site={selectedSite} onClose={handleCloseCallout} onViewDetails={handleViewDetails}/>
        )}

        {/* Dive Site Modal (for detailed view) */}
        <DiveSiteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onDirections={() => {}}
          onJoinTrip={(trip) => console.log('Joining', trip.name)}
          data={DIVE_SITE_MODAL_MOCK}
        />
      </View>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // ── Map
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // ── Search Bar
  searchWrapper: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    marginRight: 8,
  },
  searchIconBtn: {
    padding: 2,
  },

  // ── Markers
  markerContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  markerTail: {
    width: 0,
    height: 0,
    alignSelf: 'center',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  // ── Callout
  calloutCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
    zIndex: 20,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  calloutBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  calloutBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  calloutName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  calloutBtn: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  calloutBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Legend
  legend: {
    position: 'absolute',
    bottom: 65,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    zIndex: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },

  // ── FAB
  fab: {
    position: 'absolute',
    bottom: 150,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
});

export default DiveSitesScreen;