// screens/subscreens/AdminPanel.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

import Admindashboard     from './Admindashboard';
import StudentMarketplace from './StudentMarketplace';
import Adminsettings      from './Adminsettings';

// ── Sub-screens reachable from the Dashboard quick-actions ─────────────────
import VerifyStudents from './admin/VerifyStudents';
import ReviewFlags    from './admin/ReviewFlags';
import Analytics      from './admin/Analytics';
import Announce       from './admin/Announce';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS  = { Home: '🏠', Marketplace: '🛒', Settings: '⚙️' };
const TAB_LABELS = { Home: 'Dashboard', Marketplace: 'Marketplace', Settings: 'Settings' };

function TabIcon({ name, focused }) {
  return (
    <View style={styles.iconWrapper}>
      <Text style={styles.emoji}>{TAB_ICONS[name]}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

// ── Dashboard stack: Dashboard + all quick-action screens ──────────────────
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome"      component={Admindashboard}     />
      <Stack.Screen name="VerifyStudents" component={VerifyStudents}     />
      <Stack.Screen name="ReviewFlags"    component={ReviewFlags}        />
      <Stack.Screen name="Analytics"      component={Analytics}          />
      <Stack.Screen name="Announce"       component={Announce}           />
    </Stack.Navigator>
  );
}

export default function AdminPanel() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.label, focused && styles.labelActive]}>
            {TAB_LABELS[route.name]}
          </Text>
        ),
        tabBarStyle:    styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Home"        component={DashboardStack}    />
      <Tab.Screen name="Marketplace" component={StudentMarketplace} />
      <Tab.Screen name="Settings"    component={Adminsettings}     />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar:      { backgroundColor: '#ffffff', borderTopWidth: 0.5, borderTopColor: '#d1fae5', height: 64, paddingBottom: 8, paddingTop: 6, elevation: 0, shadowOpacity: 0 },
  tabItem:     { alignItems: 'center', justifyContent: 'center' },
  iconWrapper: { alignItems: 'center', justifyContent: 'center' },
  emoji:       { fontSize: 20 },
  dot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: '#16a34a', marginTop: 2 },
  label:       { fontSize: 10, fontWeight: '600', color: '#9ca3af' },
  labelActive: { color: '#16a34a' },
});