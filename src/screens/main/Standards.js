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
import { Link } from '@react-navigation/native';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const LEARN_SECTIONS = [
  {
    id: 'divers',
    sectionTitle: 'For official scuba diving regulations and professional certification standards, please refer to:',
    modules: [
      {
        id: 'm1',
        title: 'Philippine Commission on Sports SCUBA Diving (PCSSD)',
        subtitle: '',
        icon: 'shield-checkmark-outline',
        iconColor: '#2563EB',
        topics: ['National regulatory authority for scuba diving standards and accreditation in the Philippines.'],
        url: 'https://www.divephilippines.com.ph'
      },
      {
        id: 'm2',
        title: 'PADI (Professional Association of Diving Instructors)',
        subtitle: '',
        icon: 'leaf-outline',
        iconColor: '#10B981',
        topics: ['International dive training organization providing globally recognized safety and certification standards.'],
        url: 'https://www.padi.com'
      },
    ],
  },
];

// ─── LearnSearchBar ──────────────────────────────────────────────────────────
const LearnSearchBar = ({ value, onChangeText }) => (
  <View style={styles.searchBar}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search diving communities and sites..."
      placeholderTextColor="#94A3B8"
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
    />
    <Ionicons name="search" size={20} color="#2563EB" />
  </View>
);

// ─── ModuleIcon ──────────────────────────────────────────────────────────────
const ModuleIcon = ({ iconName, iconColor }) => (
  <View style={[styles.moduleIcon, { backgroundColor: iconColor + '18' }]}>
    <Ionicons name={iconName} size={26} color={iconColor} />
  </View>
);

// ─── TopicList ───────────────────────────────────────────────────────────────
const TopicList = ({ topics }) => (
  <View style={styles.topicList}>
    {topics.map((topic, index) => (
      <View key={index} style={styles.topicRow}>
        <View style={styles.topicBullet} />
        <Text style={styles.topicText}>{topic}</Text>
      </View>
    ))}
  </View>
);

// ─── ModuleCard ──────────────────────────────────────────────────────────────
const ModuleCard = ({ module, onStart }) => (
  <View style={styles.moduleCard}>
    <View style={styles.moduleHeader}>
      <ModuleIcon iconName={module.icon} iconColor={module.iconColor} />
      <View style={styles.moduleTitleBlock}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
      </View>
    </View>
    <View style={styles.divider} />
    <TopicList topics={module.topics} />
    <TouchableOpacity
      style={styles.startButton}
      onPress={() => onStart(module)}
      activeOpacity={0.85}
    >
      <Text style={styles.startButtonText}>Go to</Text>
      <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
  </View>
);

// ─── LearnSection ────────────────────────────────────────────────────────────
const LearnSection = ({ section, onStart }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{section.sectionTitle}</Text>
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
          m.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter((s) => s.modules.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerWave}>{'~~ '}</Text>
          <Text style={styles.headerTitle}>SAFETY AND STANDARDS</Text>
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
  headerWave: {
    fontSize: 18,
    color: BLUE,
    fontWeight: '900',
    marginRight: 4,
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
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    marginRight: 8,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 0.1,
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
    marginBottom: 12,
    gap: 12,
  },
  moduleIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
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
    marginBottom: 3,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  topicList: {
    gap: 6,
    marginBottom: 16,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topicBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  topicText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
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
});

export default StandardsScreen;