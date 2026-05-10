import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const LEARN_SECTIONS = [
  {
    id: 'divers',
    sectionTitle: 'FOR DIVERS',
    modules: [
      {
        id: 'd1',
        title: 'Dive Smart',
        subtitle: 'Safety Basics · 4 lessons',
        buttonText: 'Start module',
      },
      {
        id: 'd2',
        title: 'Responsible Diving',
        subtitle: 'Sustainable Practices · 4 lessons',
        buttonText: 'Start module',
      },
    ],
  },
  {
    id: 'marine_awareness',
    sectionTitle: 'MARINE AWARENESS',
    badge: 'new',
    modules: [
      {
        id: 'ma1',
        title: "Understanding Cebu's Reefs",
        subtitle: 'Marine ecosystem overview · 5 lessons',
        buttonText: 'Start module',
      },
      {
        id: 'ma2',
        title: 'Reef Protection Guidelines',
        subtitle: 'What to do and avoid · 3 lessons',
        buttonText: 'Start module',
      },
    ],
  },
  {
    id: 'marine_species',
    sectionTitle: 'MARINE SPECIES EXPLORER',
    modules: [
      {
        id: 'ms1',
        title: 'Introduction to Marine Life',
        subtitle: 'Safety Basics · 4 lessons',
        buttonText: 'Start module',
      },
    ],
  },
  {
    id: 'citizen_science',
    sectionTitle: 'CITIZEN SCIENCE',
    badge: 'future',
    modules: [
      {
        id: 'cs1',
        icon: 'flask',
        title: 'Biodiversity Observations',
        subtitle: 'Log sightings - Contribute data - Coming soon',
        hasButton: false,
      },
    ],
  },
];

// ─── LearnSearchBar ──────────────────────────────────────────────────────────
const LearnSearchBar = ({ value, onChangeText }) => (
  <View style={styles.searchBar}>
    <Ionicons name="search" size={20} color="#94A3B8" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search topics and species..."
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
    />
  </View>
);

// ─── ModuleCard ──────────────────────────────────────────────────────────────
const ModuleCard = ({ module, onStart }) => (
  <View style={styles.moduleCard}>
    <View style={styles.moduleHeader}>
      {module.icon && (
        <View style={styles.smallIcon}>
          <Ionicons name={module.icon} size={20} color="#2563EB" />
        </View>
      )}
      <View style={styles.moduleTitleBlock}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
      </View>
    </View>
    {module.hasButton !== false && (
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => onStart(module)}
        activeOpacity={0.85}
      >
        <Text style={styles.startButtonText}>{module.buttonText || 'Start module'}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── LearnSection ────────────────────────────────────────────────────────────
const LearnSection = ({ section, onStart }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
      {section.badge && (
        <View style={[styles.badge, section.badge === 'future' ? styles.badgeFuture : styles.badgeNew]}>
          <Text style={[styles.badgeText, section.badge === 'future' ? styles.badgeTextFuture : styles.badgeTextNew]}>{section.badge}</Text>
        </View>
      )}
    </View>
    {section.modules.map((module) => (
      <ModuleCard key={module.id} module={module} onStart={onStart} />
    ))}
  </View>
);

// ─── LEARN SCREEN ────────────────────────────────────────────────────────────
const StandardsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartModule = async (module) => {
    if (!module.url) return;
    const supported = await Linking.canOpenURL(module.url);
    if (supported) {
      await Linking.openURL(module.url);
    } else {
      Alert.alert('Error', `Cannot open URL: ${module.url}`);
    }
  };

  const filteredSections = LEARN_SECTIONS
    .map((section) => ({
      ...section,
      modules: section.modules.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((s) => s.modules.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerTitle}>LEARN</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LearnSearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {filteredSections.map((section) => (
          <LearnSection key={section.id} section={section} onStart={handleStartModule} />
        ))}

        {filteredSections.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No modules found</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const BLUE = '#2563EB';
const BG   = '#F8FAFF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },

  scrollView: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 8,
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeNew: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextNew: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    textTransform: 'uppercase',
  },
  badgeFuture: {
    backgroundColor: '#F1F5F9',
  },
  badgeTextFuture: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitleBlock: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  moduleSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

export default StandardsScreen;