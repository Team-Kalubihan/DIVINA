import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 16 * 2 - 10) / 2;

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const SHOP = {
  name: "Maria's Diving Shop",
  verified: true,
  verifiedLabel: 'Verified Local Operator',
  rating: 4.2,
  ratingTotal: 5,
  avatarUri: 'https://api.dicebear.com/7.x/adventurer/png?seed=Maria',
  mapUri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?w=800&q=80',
};

const SERVICES = [
  {
    id: '1',
    title: 'Service offered',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    imageUri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
  },
  {
    id: '2',
    title: 'Service offered',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et d',
    imageUri: 'https://images.unsplash.com/photo-1518820945074-5e797f1ebf2f?w=400&q=80',
  },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Product Name',
    imageUri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
  },
  {
    id: '2',
    name: 'Product Name',
    imageUri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: '3',
    name: 'Product Name',
    imageUri: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
  },
  {
    id: '4',
    name: 'Product Name',
    imageUri: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=400&q=80',
  },
];

// ─── MapBanner ───────────────────────────────────────────────────────────────
const MapBanner = ({ mapUri }) => (
  <View style={styles.mapContainer}>
    <ImageBackground source={{ uri: mapUri }} style={styles.mapImage} imageStyle={styles.mapImageStyle}>
      <View style={styles.mapOverlay} />
      {/* Simulated map pin */}
      <View style={styles.mapPin}>
        <Text style={styles.mapPinText}>📍</Text>
      </View>
    </ImageBackground>
  </View>
);

// ─── ShopInfo ────────────────────────────────────────────────────────────────
const ShopInfo = ({ shop }) => (
  <View style={styles.shopInfoContainer}>
    {/* Avatar */}
    <Image source={{ uri: shop.avatarUri }} style={styles.shopAvatar} />

    {/* Details */}
    <View style={styles.shopDetails}>
      <Text style={styles.shopName}>{shop.name}</Text>

      <View style={styles.verifiedRow}>
        <Text style={styles.verifiedText}>{shop.verifiedLabel}</Text>
        {shop.verified && <Text style={styles.verifiedIcon}> ✔</Text>}
      </View>

      <View style={styles.ratingRow}>
        <Text style={styles.ratingLabel}>Ratings</Text>
        <Text style={styles.ratingValue}>{shop.rating}/{shop.ratingTotal}</Text>
        <Text style={styles.ratingStar}>★</Text>
      </View>
    </View>
  </View>
);

// ─── InquireButton ───────────────────────────────────────────────────────────
const InquireButton = ({ onPress }) => (
  <TouchableOpacity style={styles.inquireButton} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.inquireButtonText}>Inquire</Text>
  </TouchableOpacity>
);

// ─── ServiceCard ─────────────────────────────────────────────────────────────
const ServiceCard = ({ service }) => (
  <TouchableOpacity style={styles.serviceCard} activeOpacity={0.85}>
    <Image source={{ uri: service.imageUri }} style={styles.serviceImage} />
    <View style={styles.serviceBody}>
      <Text style={styles.serviceTitle}>{service.title}</Text>
      <Text style={styles.serviceDesc} numberOfLines={3}>
        {service.description}
      </Text>
    </View>
  </TouchableOpacity>
);

// ─── ServicesSection ─────────────────────────────────────────────────────────
const ServicesSection = ({ services }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Services</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScroll}>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </ScrollView>
  </View>
);

// ─── ProductCard ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <TouchableOpacity style={styles.productCard} activeOpacity={0.85}>
    <Image source={{ uri: product.imageUri }} style={styles.productImage} resizeMode="contain" />
    <Text style={styles.productName}>{product.name}</Text>
  </TouchableOpacity>
);

// ─── ProductsSection ─────────────────────────────────────────────────────────
const ProductsSection = ({ products }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Products</Text>
    <View style={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </View>
  </View>
);

// ─── OPERATOR PROFILE SCREEN ─────────────────────────────────────────────────────
const OperatorProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Map Banner at the top */}
        <MapBanner mapUri={SHOP.mapUri} />

        {/* Shop Info Card */}
        <View style={styles.infoCard}>
          <ShopInfo shop={SHOP} />
          <InquireButton onPress={() => {}} />
        </View>

        {/* Services */}
        <ServicesSection services={SERVICES} />

        {/* Products */}
        <ProductsSection products={PRODUCTS} />

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE_PRIMARY = '#2563EB';
const BG           = '#F0F4FF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // ── Map Banner
  mapContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#CBD5E1',
  },
  mapImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImageStyle: {
    opacity: 0.85,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200,220,255,0.15)',
  },
  mapPin: {
    position: 'absolute',
    bottom: '30%',
    left: '48%',
  },
  mapPinText: {
    fontSize: 28,
  },

  // ── Info Card
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -28,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  shopInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  shopAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#E0EAFF',
    marginRight: 12,
    backgroundColor: '#DBEAFE',
  },
  shopDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  shopName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  ratingStar: {
    fontSize: 13,
    color: '#F59E0B',
  },

  // ── Inquire Button
  inquireButton: {
    backgroundColor: BLUE_PRIMARY,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: BLUE_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 4,
  },
  inquireButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Section
  section: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 0.1,
  },

  // ── Service Cards (horizontal scroll)
  servicesScroll: {
    gap: 12,
    paddingRight: 4,
  },
  serviceCard: {
    width: 185,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 110,
  },
  serviceBody: {
    padding: 10,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  // ── Product Grid
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#F8FAFC',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    paddingHorizontal: 10,
    marginTop: 6,
  },

  // ── Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0EAFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  tabIconActive: {
    color: BLUE_PRIMARY,
  },
});

export default OperatorProfileScreen;