import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/DIVINA logo.svg';

export default function Register({ navigation }) {
  const [certificate, setCertificate] = useState('');
  const [bir, setBir] = useState('');

  function handleUploadCert() {
    // TODO: Handle login logic here
  }

  function handleUploadBIR() {
    // TODO: Handle signup logic here
  }

  function handleNext() {
    // TODO: Handle next logic here
    navigation.navigate('RegisterCred');
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
            <Text style={{ ...styles.touchableLabel, color: '#636D7D', fontSize: 16 }}>Upload</Text>
            <Ionicons name={'cloud-upload'} size={20} color="#636D7D" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16, }}>
          <Text style={styles.label}>BIR</Text>
          <TouchableOpacity style={{...styles.uploadButton, flexDirection: 'row'}} onPress={handleUploadBIR}>
            <Text style={{ ...styles.touchableLabel, color: '#636D7D', fontSize: 16 }}>Upload</Text>
            <Ionicons name={'cloud-upload'} size={20} color="#636D7D" style={{ marginLeft: 8 }} />
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