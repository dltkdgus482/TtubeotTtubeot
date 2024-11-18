import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import JournalScreen from '../../screens/Journal/JournalScreen';

const Stack = createStackNavigator();

const JournalStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="JournalScreen" component={JournalScreen} />
    </Stack.Navigator>
  );
};

export default JournalStackNavigator;
