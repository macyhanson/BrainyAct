import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen        from '../screens/HomeScreen';
import ProgressScreen    from '../screens/ProgressScreen';
import SessionsScreen    from '../screens/SessionsScreen';
import AssessmentsScreen from '../screens/AssessmentsScreen';
import { colors, typography } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color }) => {
            const icons: Record<string, [string, string]> = {
              Home:        ['home',         'home-outline'],
              Progress:    ['trending-up',  'trending-up-outline'],
              Sessions:    ['game-controller', 'game-controller-outline'],
              Assessments: ['clipboard',    'clipboard-outline'],
            };
            const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
            return <Ionicons name={(focused ? active : inactive) as any} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home"        component={HomeScreen}        options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Progress"    component={ProgressScreen}    options={{ tabBarLabel: 'Progress' }} />
        <Tab.Screen name="Sessions"    component={SessionsScreen}    options={{ tabBarLabel: 'Sessions' }} />
        <Tab.Screen name="Assessments" component={AssessmentsScreen} options={{ tabBarLabel: 'Assessments' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
});
