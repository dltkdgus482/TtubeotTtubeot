import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../screens/Home/HomeScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
