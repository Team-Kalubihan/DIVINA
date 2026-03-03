import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/DIVINA logo.svg';

const DIVE_LEVELS = ['Beginner', 'Open Water', 'Advanced', 'Technical'];

function DiveLevelPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
      <>
        {/* Trigger*/}
        <TouchableOpacity
        style = {styles.pickerTrigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        >
          <Text style={[styles.pickerText, !value && {color: "#A0AEC0"}]}>{value || "Select dive Level"}</Text>
          <Ionicons name={"chevron-down"} size={20} color={"#A0AEC0"}/>
        </TouchableOpacity>

        {/** Dropdown Modal */}
        <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
          <TouchableOpacity style={styles.pickerBackdrop} activeOpacity={1} onPress={() => setOpen(false)}>
            <View style={styles.pickerDropdown}>
              <Text style={styles.pickerDropdownTitle}>Dive Level</Text>
              {DIVE_LEVELS.map((level) => (
                  <TouchableOpacity
                      key={level}
                      style={[styles.pickerOption, value === level && styles.pickerOptionSelected]}
                      onPress={() => { onChange(level); setOpen(false); }}
                      activeOpacity={0.7}
                  >
                    <Text style={[styles.pickerOptionText, value === level && styles.pickerOptionTextSelected]}>
                      {level}
                    </Text>
                    {value === level && (
                        <Ionicons name="checkmark" size={16} color="#007BFF" />
                    )}
                  </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
  );
}

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [diveLevel, setDiveLevel] = useState('');

  function handleNext() {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }
    navigation.navigate('RegisterCred', { firstName, lastName, isOperator: false });
  }



  function handleRegisterAsOp() {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'Please enter your name first.');
      return;
    }
    navigation.navigate('RegisterAsOperator', { firstName, lastName });
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

        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, marginBottom: -11, marginStart: 0 }}>Register to</Text>
        <Logo width={190} height={50} />

        {/* <Text style={{ fontSize: 16, color: '#666' }}>Your diving companion app.</Text> */}

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* ── Dive Level Picker ── */}
        <View style={{ marginTop: 16, width: 300 }}>
          <Text style={styles.label}>Dive level</Text>
          <DiveLevelPicker value={diveLevel} onChange={setDiveLevel} />
        </View>

        <TouchableOpacity style={{...styles.button, marginTop: 46}} 
          onPress={handleNext}>
          <Text style={{ ...styles.touchableLabel, color: '#fff' }}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            ...styles.button, 
            marginTop: 12,
            backgroundColor: 'white',
            borderColor: '#CFCFCF',
            borderWidth: 1,
          }} 
          onPress={handleRegisterAsOp}>
          <Text style={{ ...styles.touchableLabel, color: '#636D7D', fontSize: 16 }}>Register as diving operator</Text>
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

  // - Picker
  // ── Picker
  pickerTrigger: {
    height: 52,
    width: 300,
    backgroundColor: '#F4F6FA',
    borderRadius: 26,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerTriggerText: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'Poppins-Regular',
  },pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  pickerDropdown: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  pickerDropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3e6b',
    textAlign: 'center',
    paddingVertical: 10,
    letterSpacing: 0.3,
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  pickerOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'Poppins-Regular',
  },
  pickerOptionTextSelected: {
    color: '#007BFF',
    fontWeight: '700',
  },
});