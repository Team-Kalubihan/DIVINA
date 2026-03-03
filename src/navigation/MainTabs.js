import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/main/Home';
import DiveSitesScreen from '../screens/main/DiveSites';
import DivePlanScreen from '../screens/main/DivePlan';
import IdentifierScreen from '../screens/main/Identifier';
import ProfileScreen from '../screens/main/Profile';
import OperatorScreen from '../screens/main/OperatorProfile';
import StandardsScreen from '../screens/main/Standards';

import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  'Home':       { active: 'home',          inactive: 'home-outline'          },
  'Dive Sites': { active: 'map',           inactive: 'map-outline'           },
  'Dive Plan':  { active: 'calendar',      inactive: 'calendar-outline'      },
  'Identifier': { active: 'grid',        inactive: 'grid-outline'        },
  'Profile':    { active: 'person',        inactive: 'person-outline'        },
  'Operator':   { active: 'storefront',    inactive: 'storefront-outline'    },
  'Standards':      { active: 'book',          inactive: 'book-outline'          },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E0EAFF',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home"       component={HomeScreen}     />
      <Tab.Screen name="Dive Sites" component={DiveSitesScreen}/>
      <Tab.Screen name="Dive Plan"  component={DivePlanScreen} />
      <Tab.Screen name="Identifier" component={IdentifierScreen}/>
      <Tab.Screen name="Profile"    component={ProfileStack}  />
      <Tab.Screen name="Standards"  component={StandardsScreen} />
    </Tab.Navigator>
  );
}