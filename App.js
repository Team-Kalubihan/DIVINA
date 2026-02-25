import 'react-native-gesture-handler';

import { StyleSheet, } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>
    //   <StatusBar style="light" />
    //   <HomeScreen />
    // </SafeAreaView>
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9ECF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
});