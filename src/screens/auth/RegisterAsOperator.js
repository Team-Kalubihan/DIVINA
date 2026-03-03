import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import Logo from '../../assets/DIVINA logo.svg';

export default function Register({ navigation, route }) {
  const { firstName, lastName } = route.params || {};
  const [certDoc, setCertDoc] = useState(null);
  const [birDoc, setBirDoc] = useState(null);

  async function handleUploadCert() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled) setCertDoc(result.assets[0]);
    } catch {
      Alert.alert('Error', 'Could not pick document.');
    }
  }

  async function handleUploadBIR() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled) setBirDoc(result.assets[0]);
    } catch {
      Alert.alert('Error', 'Could not pick document.');
    }
  }

  function handleNext() {
    if (!certDoc || !birDoc) {
      Alert.alert('Error', 'Please upload both documents.');
      return;
    }
    navigation.navigate('RegisterCred', { firstName, lastName, isOperator: true, certDoc, birDoc });
  }

  function back() {
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 20 }} onPress={back}>
          <Ionicons name={'arrow-back'} size={24} color="#636D7D" />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, marginBottom: -11, marginStart: 0 }}>Welcome to</Text>
        <Logo width={190} height={50} />

        {/* <Text style={{ fontSize: 16, color: '#666' }}>Your diving companion app.</Text> */}

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Certificate</Text>
          <TouchableOpacity style={{...styles.uploadButton, flexDirection: 'row'}} onPress={handleUploadCert}>
            <Text style={{ ...styles.touchableLabel, color: '#636D7D', fontSize: 16 }}>
              {certDoc ? certDoc.name : 'Upload'}
            </Text>
            <Ionicons name={certDoc ? 'checkmark-circle' : 'cloud-upload'} size={20} color={certDoc ? '#10B981' : '#636D7D'} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16, }}>
          <Text style={styles.label}>BIR</Text>
          <TouchableOpacity style={{...styles.uploadButton, flexDirection: 'row'}} onPress={handleUploadBIR}>
            <Text style={{ ...styles.touchableLabel, color: '#636D7D', fontSize: 16 }}>
              {birDoc ? birDoc.name : 'Upload'}
            </Text>
            <Ionicons name={birDoc ? 'checkmark-circle' : 'cloud-upload'} size={20} color={birDoc ? '#10B981' : '#636D7D'} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{...styles.button, marginTop: 46}} 
          onPress={handleNext}>
          <Text style={{ ...styles.touchableLabel, color: '#fff' }}>Next</Text>
        </TouchableOpacity>
          
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4FF'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 36,
    margin: 20,
    padding: 30,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 6, 
    marginStart: 2
  },
  touchableLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  input: {
    height: 52,
    width: 300, 
    backgroundColor: '#F4F6FA',
    borderRadius: 26,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    width: 300,
    height: 52,
    borderRadius: 26,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6FA',
    paddingVertical: 12,
    width: 300,
    height: 52,
    borderRadius: 16,
  }
});