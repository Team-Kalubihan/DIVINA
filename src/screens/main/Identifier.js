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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Logo from '../../assets/DIVINA logo.svg';
import { Identify } from '../../../API';

const { width } = Dimensions.get('window');

// ─── Click Handlers ─────────────────────────────────────────────────────
const handleCameraPress = async ({ onImageSelected }) => {
  try {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to take photos for species identification.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      console.log('Photo taken:', photo.uri);
      // TODO: pass photo.uri to your identifier logic
      onImageSelected(photo.uri, 'camera');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong opening the camera.');
    console.error(error);
  }
};

const handleUploadPress = async ({ onImageSelected }) => {
  try {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Gallery access is needed to upload photos for species identification.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const photo = result.assets[0];
      console.log('Photo uploaded:', photo.uri);
      // TODO: pass photo.uri to your identifier logic
      onImageSelected(photo.uri, 'upload');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong opening the gallery.');
    console.error(error);
  }
};

// ─── IdentifierCard ─────────────────────────────────────────────────────
const IdentifierButtons = ({ icon, label, onImageSelected }) => (
  <TouchableOpacity 
    style={{...styles.identifierCard, alignContent: 'center', justifyContent: 'center'}} 
    activeOpacity={0.85}
    onPress={() => (icon === 'camera' ? handleCameraPress({onImageSelected}) : handleUploadPress({onImageSelected}))}>
    <View style={{...styles.identifierRow, justifyContent: 'center', alignItems: 'center'}}>
      <Ionicons name={icon} size={16} color={'#2563EB'} />
      <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '500' }}>
          {label}
        </Text>
    </View>
  </TouchableOpacity>
);

// ─── UploadAndCameraSection ─────────────────────────────────────────────────
const UploadAndCameraSection = ({ onImageSelected }) => (
  <View style={styles.marineSection}>
    <Logo width={150} height={30} marginBottom={12}/>
    <View style={styles.conditionsGrid}>
      <IdentifierButtons icon="cloud-upload" label="Upload"          value="28°C"      onImageSelected={onImageSelected} />
      <IdentifierButtons icon="camera"       label="Take a picture"  value="Safe"      onImageSelected={onImageSelected} />
    </View>
    <View style={styles.descriptionContainer}>
      <Text style={styles.descriptionText}>
        Take a picture or upload one for an instant identification of the marine species.
      </Text>
      <Text style={{...styles.descriptionText, fontStyle: 'italic', fontSize: 11, marginTop: 8}}>
        note: camera taken pictures will be the only ones legible for points.
      </Text>
    </View>
  </View>
);

// ─── IdentifiedCard ────────────────────────────────────────────────────────────────
const IdentifiedCard = ({ name, scientificName, imageUri }) => (
  <TouchableOpacity style={styles.identifiedCard} activeOpacity={0.85}>
    <ImageBackground
      source={{ uri: imageUri }}
      style={styles.identifiedImage}
      imageStyle={styles.identifiedImageStyle}
    >
      <View style={styles.identifiedImageOverlay} />
    </ImageBackground>
    <View style={styles.identifiedNameContainer}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B' }}>{name}</Text>
      <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#64748B' }}>{scientificName}</Text>
    </View>
  </TouchableOpacity>
);

// ─── IdentifiedSection ─────────────────────────────────────────────────────
const IdentifiedSection = ({ title, identified }) => (
  <View style={styles.identifiedSection}>
    <Text style={{fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 6}}>{title}</Text>
    {identified.map((species) => (
      <IdentifiedCard key={species.name} name={species.name} scientificName={species.scientificName} imageUri={species.imageUri} />
    ))}
  </View>
);

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const identified = [
  { name: 'Clownfish', scientificName: 'Amphiprion ocellaris', imageUri: 'https://a-z-animals.com/media/clownfish-2.jpg' },
  { name: 'Blue Tang', scientificName: 'Paracanthurus hepatus', imageUri: 'https://a-z-animals.com/media/2021/11/blue-tang-768x401.jpg' },
  { name: 'Sea Turtle', scientificName: 'Chelonia mydas', imageUri: 'https://www.fisheries.noaa.gov/s3//dam-migration/green_sea_turtle.jpg?itok=ALDx4VNR' },
];

// ─── IDENTIFIER SCREEN ────────────────────────────────────────────────────────
const IdentifierScreen = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSource, setImageSource]     = useState(null);
  const [identifying, setIdentifying]     = useState(false);
  const [results, setResults]             = useState(identified);

  const onImageSelected = async (uri, source) => {
    setSelectedImage(uri);
    setImageSource(source);
    setIdentifying(true);
    try {
      const data = await Identify.identify(uri);
      if (data.species) {
        const newEntry = {
          name: data.species.common_name || data.classification.label,
          scientificName: data.species.name,
          imageUri: data.species.photo_url || uri,
          confidence: data.classification.confidence,
        };
        setResults((prev) => [newEntry, ...prev]);
      } else {
        Alert.alert('Unknown Species', data.message || 'Could not confidently classify the image.');
      }
    } catch (err) {
      Alert.alert('Identification Failed', err.message || 'Something went wrong.');
    } finally {
      setIdentifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Identifier card */}
        <View style={styles.marineCard}>
          <UploadAndCameraSection onImageSelected={onImageSelected} />
        </View>

        {/* Loading indicator */}
        {identifying && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={{ color: '#64748B', marginTop: 8, fontSize: 13 }}>Identifying species...</Text>
          </View>
        )}

        {/* Recent Identifications card */}
        <IdentifiedSection title="Recent Identifications" identified={results} />

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

  // ── Identifier Card
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
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  identifierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    paddingVertical: 30,
    width: (width - 32 - 32 - 10) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  identifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionContainer: {
    marginTop: 12,
    backgroundColor: BLUE_LIGHT,
    borderRadius: 12,
    padding: 12,
  },
  descriptionText: {
    fontSize: 12,
    color: '#1E293B',
    textAlign: 'center',
  },

  // ── Recent Identifications
  identifiedSection: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },

  // Identified Cards
  identifiedCard: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    height: 90,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  identifiedImage: {
    width: 130,
    height: 90,
  },
  identifiedImageStyle: {
    borderRadius: 0,
  },
  identifiedImageOverlay: {
    borderRadius: 0,
  },
  identifiedNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
  },
});

export default IdentifierScreen;