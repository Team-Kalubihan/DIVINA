import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import RegisterAsOpScreen from '../screens/auth/RegisterAsOperator';
import RegisterCredScreen from '../screens/auth/RegisterCred';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='RegisterAsOperator' component={RegisterAsOpScreen} />
      <Stack.Screen name='RegisterCred' component={RegisterCredScreen} />
    </Stack.Navigator>
  );
}