import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RankingScreen from '../../screens/Ranking/RankingScreen';

const Stack = createStackNavigator();

const RankingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="RankingScreen" component={RankingScreen} />
    </Stack.Navigator>
  );
};

export default RankingStackNavigator;
