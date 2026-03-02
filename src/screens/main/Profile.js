import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const USER = {
  name: 'Maria Dela Cruz',
  role: 'Diver',
  points: 434.76,
  avatarUri: 'https://api.dicebear.com/7.x/adventurer/png?seed=Maria',
  bannerUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
};

const NEARBY_SHOPS = [
  {
    id: '1',
    name: "Maria's Diving Shop",
    rating: 4.7,
    distance: '102km away from your current location',
    isOpen: true,
    traffic: 'low traffic',
    imageUri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=80',
  },
];

const REDEEM_ITEMS = [
  { id: '1', category: 'Some restaurant discount voucher', title: '20% off',        points: 250 },
  { id: '2', category: 'Some store gift cash',             title: 'P100',           points: 140 },
  { id: '3', category: 'Some store specific item',         title: '1 can of something', points: 150 },
  { id: '4', category: 'Some restaurant discount voucher', title: '25% off',        points: 280 },
  { id: '5', category: 'Some restaurant discount voucher', title: '25% off',        points: 280 },
];

// ─── ProfileHeader ───────────────────────────────────────────────────────────
const ProfileHeader = ({ user }) => (
  <View style={styles.profileHeaderContainer}>
    {/* Banner */}
    <ImageBackground
      source={{ uri: user.bannerUri }}
      style={styles.banner}
      imageStyle={styles.bannerImage}
    >
      <View style={styles.bannerOverlay} />
    </ImageBackground>

    {/* Avatar */}
    <View style={styles.avatarWrapper}>
      <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
    </View>

    {/* Name & Role */}
    <Text style={styles.userName}>{user.name}</Text>
    <View style={styles.roleBadge}>
      <Text style={styles.roleText}>{user.role}</Text>
    </View>

    {/* Points */}
    <View style={styles.pointsRow}>
      <Text style={styles.pointsLabel}>Earned Points:</Text>
      <Text style={styles.pointsValue}>{user.points.toFixed(2)}</Text>
    </View>
  </View>
);

// ─── ShopCard ────────────────────────────────────────────────────────────────
const ShopCard = ({ shop }) => (
  <TouchableOpacity style={styles.shopCard} activeOpacity={0.85}>
    <Image source={{ uri: shop.imageUri }} style={styles.shopImage} />
    <View style={styles.shopInfo}>
      <View style={styles.shopNameRow}>
        <Text style={styles.shopName}>{shop.name}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{shop.rating}</Text>
        </View>
      </View>
      <Text style={styles.shopDistance}>📍 {shop.distance}</Text>
      <View style={styles.shopTags}>
        {shop.isOpen && (
          <View style={styles.tagOpen}>
            <Text style={styles.tagOpenText}>✓ open</Text>
          </View>
        )}
        <View style={styles.tagTraffic}>
          <Text style={styles.tagTrafficText}>{shop.traffic}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// ─── ShopNearYouSection ──────────────────────────────────────────────────────
const ShopNearYouSection = ({ shops }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Shop near you</Text>
      <TouchableOpacity>
        <Text style={styles.sectionLink}>Explore more shops</Text>
      </TouchableOpacity>
    </View>
    {shops.map((shop) => (
      <ShopCard key={shop.id} shop={shop} />
    ))}
  </View>
);

// ─── RedeemItem ──────────────────────────────────────────────────────────────
const RedeemItem = ({ item }) => (
  <TouchableOpacity style={styles.redeemCard} activeOpacity={0.8}>
    {/* Icon */}
    <View style={styles.redeemIcon}>
      <Text style={styles.redeemIconText}>%</Text>
    </View>

    {/* Text */}
    <View style={styles.redeemContent}>
      <Text style={styles.redeemCategory}>{item.category}</Text>
      <Text style={styles.redeemTitle}>{item.title}</Text>
    </View>

    {/* Points */}
    <Text style={styles.redeemPoints}>{item.points}pts</Text>
  </TouchableOpacity>
);

// ─── RedeemSection ───────────────────────────────────────────────────────────
const RedeemSection = ({ items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Redeem</Text>
    {items.map((item) => (
      <RedeemItem key={item.id} item={item} />
    ))}
  </View>
);

// ─── PROFILE SCREEN ──────────────────────────────────────────────────────────
const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={USER} />
        <ShopNearYouSection shops={NEARBY_SHOPS} />
        <RedeemSection items={REDEEM_ITEMS} />
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE_PRIMARY = '#2563EB';
const BLUE_CARD    = '#3B82F6';
const BG           = '#F0F4FF';
const RED_VOUCHER  = '#EF4444';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  // ── Profile Header
  profileHeaderContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 130,
  },
  bannerImage: {
    borderRadius: 0,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59,130,246,0.45)',
  },
  avatarWrapper: {
    marginTop: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#DBEAFE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  roleBadge: {
    marginTop: 6,
    backgroundColor: '#FEF08A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#713F12',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },

  // ── Sections
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.1,
    marginBottom: 10,
  },
  sectionLink: {
    fontSize: 12,
    color: BLUE_CARD,
    fontWeight: '500',
  },

  // ── Shop Card
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  shopImage: {
    width: 90,
    height: 90,
  },
  shopInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  shopNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  shopDistance: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  shopTags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tagOpen: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagOpenText: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '600',
  },
  tagTraffic: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagTrafficText: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '600',
  },

  // ── Redeem Cards
  redeemCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
  },
  redeemIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: RED_VOUCHER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  redeemIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  redeemContent: {
    flex: 1,
  },
  redeemCategory: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  redeemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  redeemPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
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

export default ProfileScreen;