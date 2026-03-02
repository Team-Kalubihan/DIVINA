import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootStack from './src/navigation/RootStack';

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>
    //   <StatusBar style="light" />
    //   <HomeScreen />
    // </SafeAreaView>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}