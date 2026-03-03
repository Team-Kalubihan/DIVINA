import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/DIVINA logo.svg';
import { useAuth } from '../../context/AuthContext';
import { Auth } from '../../../API';

export default function Register({ navigation, route }) {
  const { firstName, lastName, isOperator, certDoc, birDoc } = route.params || {};
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword1, setShowPassword1] = useState(true);
  const [showPassword2, setShowPassword2] = useState(true);

  async function handleNext() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      let data;
      if (isOperator) {
        data = await Auth.signUpOperator({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          birDocument: birDoc,
          certificationDocument: certDoc,
        });
      } else {
        data = await Auth.signUpRegular({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        });
      }
      loginUser(data.user);
    } catch (err) {
      Alert.alert('Registration Failed', err.message || 'Could not register.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: 20 }} onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={24} color="#636D7D" />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, marginBottom: -11, marginStart: 0 }}>Welcome to</Text>
        <Logo width={190} height={50} />

        {/* <Text style={{ fontSize: 16, color: '#666' }}>Your diving companion app.</Text> */}

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={showPassword1}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={{ position: 'absolute', right: 20, top: 38 }}
            onPress={() => setShowPassword1(!showPassword1)}>
            <Ionicons 
              name={showPassword1 ? 'eye-off' : 'eye'} 
              size={20} 
              color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.label}>Confirm Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={showPassword2}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={{ position: 'absolute', right: 20, top: 38 }}
            onPress={() => setShowPassword2(!showPassword2)}>
            <Ionicons 
              name={showPassword2 ? 'eye-off' : 'eye'} 
              size={20} 
              color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{...styles.button, marginTop: 46}} 
          onPress={handleNext}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ ...styles.touchableLabel, color: '#fff' }}>Sign Up</Text>
          )}
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
  }
});