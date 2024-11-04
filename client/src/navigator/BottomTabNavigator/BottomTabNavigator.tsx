import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdventureStackNavigator from './AdventureStackNavigator';
import JournalStackNavigator from './JournalStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import RankingStackNavigator from './RankingStackNavigator';
import Icon from '../../components/Icon';

const Tab = createBottomTabNavigator();

type IconType =
  | 'Ionicons'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Octicons'
  | undefined;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          let iconType: IconType;

          if (route.name === 'Adventure') {
            iconName = 'compass';
            iconType = 'FontAwesome5';
          } else if (route.name === 'Journal') {
            iconName = 'log';
            iconType = 'Octicons';
          } else if (route.name === 'Home') {
            iconName = 'home';
            iconType = 'Ionicons';
          } else if (route.name === 'Ranking') {
            iconName = 'ranking-star';
            iconType = 'FontAwesome6';
          } else if (route.name === 'Profile') {
            iconName = 'user-gear';
            iconType = 'FontAwesome6';
          } else {
            iconName = '';
            iconType = undefined;
          }

          return (
            <View
              style={{
                backgroundColor: focused ? '#C7E5C4' : 'transparent',
                borderRadius: focused ? 30 : 0,
                padding: 8,
              }}>
              <Icon
                type={iconType}
                name={iconName ? iconName : ''}
                size={size + 5}
                color={color}
              />
            </View>
          );
        },
        tabBarActiveTintColor: '#3E4A3D',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 85,
          paddingTop: 14,
          paddingBottom: 15,
          backgroundColor: '#F2F4F5',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}>
      <Tab.Screen name="Journal" component={JournalStackNavigator} />
      <Tab.Screen name="Adventure" component={AdventureStackNavigator} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Ranking" component={RankingStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
