import { createNativeStackNavigator } from "@react-navigation/native-stack"; 

import ProfileScreen from '../screens/main/Profile';
import OperatorScreen from '../screens/main/OperatorProfile';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Operator" 
        component={OperatorScreen}
        options={{ title: "Operator Profile" }}
      />
    </Stack.Navigator>
  );
}