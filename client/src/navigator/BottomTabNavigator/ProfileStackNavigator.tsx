import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import FindPasswordScreen from '../../screens/Profile/FindPasswordScreen';
import SetNewPasswordScreen from '../../screens/Profile/SetNewPasswordScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
      <Stack.Screen name="SetNewPasswordScreen" component={SetNewPasswordScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
