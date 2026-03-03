import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from '../context/AuthContext';

import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4FF' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ): (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}