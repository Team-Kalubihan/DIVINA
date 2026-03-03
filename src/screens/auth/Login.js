import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import Logo from '../../assets/DIVINA logo.svg';
import { useAuth } from '../../context/AuthContext';
import { Auth } from '../../../API';

export default function Login({ navigation }) {

  const { loginUser } = useAuth()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(true);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await Auth.login({ email, password });
      loginUser(data.user);
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleSignup() {
      navigation.navigate('Register');
  }

  function handleForgotPassword() {
      // TODO: Handle forgot password logic here
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.card}>

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
            secureTextEntry={showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={{ position: 'absolute', right: 20, top: 38 }}
            onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color="gray" />
          </TouchableOpacity>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 4 }} 
            onPress={handleForgotPassword}>
            <Text style={{ ...styles.touchableLabel, color: '#007BFF', fontWeight: 'regular', fontSize: 14 }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{...styles.button, marginTop: 26}} 
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ ...styles.touchableLabel, color: '#fff' }}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 16 }} 
          onPress={handleSignup}>
          <Text style={{ ...styles.touchableLabel, color: '#007BFF', fontSize: 14 }}>Don't have an account? Sign Up</Text>
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