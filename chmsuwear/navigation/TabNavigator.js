// navigation/TabNavigator.js
// All custom SVG icons + bottom tab navigator in one file

import React from 'react';
import Svg, {
  Polygon,
  Rect,
  Circle,
  Path,
  Line,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your actual screens here
import HomeScreen      from '../screens/HomeScreen';
import MarketScreen    from '../screens/MarketScreen';
import SellScreen      from '../screens/SellScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SettingsScreen  from '../screens/SettingsScreen';

// ── Colors ────────────────────────────────────────────────────────────────────
const ACTIVE_COLOR   = '#064e3b';
const INACTIVE_COLOR = '#9ca3af';
const DOT_COLOR      = '#16a34a';
const WHITE          = '#ffffff';

// ── Home Icon ─────────────────────────────────────────────────────────────────
const HomeIcon = ({ active = false, size = 28 }) => {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <Svg width={size} height={size} viewBox="-16 -20 32 38">
      <Polygon points="0,-16 -14,-2 14,-2" fill={color} />
      <Rect x="-11" y="-2" width="22" height="16" rx="2" fill={color} />
      <Rect x="-4" y="5" width="8" height="9" rx="1.5" fill={WHITE} />
      {active && <Circle cx="0" cy="18" r="2.5" fill={DOT_COLOR} />}
    </Svg>
  );
};

// ── Market Icon ───────────────────────────────────────────────────────────────
const MarketIcon = ({ active = false, size = 28 }) => {
  const color     = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  const badgeBg   = active ? '#dcfce7'    : '#f3f4f6';
  const badgeText = active ? '#16a34a'    : '#9ca3af';
  return (
    <Svg width={size} height={size} viewBox="-18 -16 36 36">
      <Path
        d="M-14,-12 L-10,-12 L-6,8 L10,8 L13,-4 L-4,-4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx="-4" cy="13" r="3" fill="none" stroke={color} strokeWidth="1.8" />
      <Circle cx="9"  cy="13" r="3" fill="none" stroke={color} strokeWidth="1.8" />
      <Circle cx="11" cy="-10" r="7" fill={badgeBg} />
      <SvgText x="11" y="-6" textAnchor="middle" fontSize="8" fontWeight="700" fill={badgeText}>₱</SvgText>
      {active && <Circle cx="0" cy="20" r="2.5" fill={DOT_COLOR} />}
    </Svg>
  );
};

// ── Sell Icon ─────────────────────────────────────────────────────────────────
const SellIcon = ({ active = false, size = 28 }) => {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <Svg width={size} height={size} viewBox="-18 -18 36 40">
      <Path
        d="M-10,-14 L8,-14 L14,-8 L14,6 L0,16 L-14,6 L-14,-8 Z"
        fill={active ? '#dcfce7' : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Circle cx="6" cy="-8" r="2.5" fill={active ? WHITE : 'transparent'} stroke={color} strokeWidth="1.5" />
      <Line x1="0"  y1="-4" x2="0" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="-5" y1="2"  x2="5" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {active && <Circle cx="0" cy="20" r="2.5" fill={DOT_COLOR} />}
    </Svg>
  );
};

// ── Community Icon ────────────────────────────────────────────────────────────
const CommunityIcon = ({ active = false, size = 28 }) => {
  const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  return (
    <Svg width={size} height={size} viewBox="-20 -18 40 40">
      <Circle cx="-6" cy="-10" r="6" fill="none" stroke={color} strokeWidth="2" />
      <Path
        d="M-17,8 Q-15,-2 -6,-2 Q3,-2 5,8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="6" cy="-10" r="6" fill={active ? '#dcfce7' : '#f9fafb'} stroke={color} strokeWidth="2" />
      <Path
        d="M-5,8 Q-3,-2 6,-2 Q15,-2 17,8"
        fill={active ? '#dcfce7' : '#f9fafb'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {active && <Circle cx="0" cy="20" r="2.5" fill={DOT_COLOR} />}
    </Svg>
  );
};

// ── Settings Icon ─────────────────────────────────────────────────────────────
const SettingsIcon = ({ active = false, size = 28 }) => {
  const color     = active ? ACTIVE_COLOR : INACTIVE_COLOR;
  const innerFill = active ? '#dcfce7'    : '#f9fafb';
  return (
    <Svg width={size} height={size} viewBox="-18 -18 36 38">
      <Circle cx="0" cy="0" r="10" fill="none" stroke={color} strokeWidth="2" />
      <Rect x="-2"  y="-15" width="4" height="6" rx="1" fill={color} />
      <Rect x="-2"  y="9"   width="4" height="6" rx="1" fill={color} />
      <Rect x="9"   y="-2"  width="6" height="4" rx="1" fill={color} />
      <Rect x="-15" y="-2"  width="6" height="4" rx="1" fill={color} />
      <G transform="rotate(45)">
        <Rect x="-2"  y="-15" width="4" height="6" rx="1" fill={color} />
        <Rect x="-2"  y="9"   width="4" height="6" rx="1" fill={color} />
        <Rect x="9"   y="-2"  width="6" height="4" rx="1" fill={color} />
        <Rect x="-15" y="-2"  width="6" height="4" rx="1" fill={color} />
      </G>
      <Circle cx="0" cy="0" r="5" fill={innerFill} stroke={color} strokeWidth="1.8" />
      {active && <Circle cx="0" cy="18" r="2.5" fill={DOT_COLOR} />}
    </Svg>
  );
};

// ── Tab Navigator ─────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth:  0.5,
          borderTopColor:  '#e2e8f0',
          height:          68,
          paddingBottom:   10,
          paddingTop:      8,
          elevation:       12,
          shadowColor:     '#000',
          shadowOffset:    { width: 0, height: -2 },
          shadowOpacity:   0.06,
          shadowRadius:    8,
        },
        tabBarLabelStyle: {
          fontSize:   11,
          fontWeight: '600',
          marginTop:  2,
        },
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Home':      return <HomeIcon      active={focused} />;
            case 'Market':    return <MarketIcon    active={focused} />;
            case 'Sell':      return <SellIcon      active={focused} />;
            case 'Community': return <CommunityIcon active={focused} />;
            case 'Settings':  return <SettingsIcon  active={focused} />;
            default:          return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      />
      <Tab.Screen name="Market"    component={MarketScreen}    />
      <Tab.Screen name="Sell"      component={SellScreen}      />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen}  />
    </Tab.Navigator>
  );
}