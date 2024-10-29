import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AdventureScreen from '../../screens/Adventure/AdventureScreen';

const Stack = createStackNavigator();

const AdventureStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AdventureScreen" component={AdventureScreen} />
    </Stack.Navigator>
  );
};

export default AdventureStackNavigator;
