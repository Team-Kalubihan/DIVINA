import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/main/Home';
import DiveSitesScreen from '../screens/main/DiveSites';
import DivePlanScreen from '../screens/main/DivePlan';
import IdentifierScreen from '../screens/main/Identifier';
import ProfileScreen from '../screens/main/Profile';
import OperatorScreen from '../screens/main/OperatorProfile';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dive Sites" component={DiveSitesScreen} />
      <Tab.Screen name="Dive Plan" component={DivePlanScreen} />
      <Tab.Screen name="Identifier" component={IdentifierScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Operator Profile" component={OperatorScreen} />
    </Tab.Navigator>
  );
}