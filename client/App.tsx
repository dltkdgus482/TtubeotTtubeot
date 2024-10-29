import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabNavigator from './src/navigator/BottomTabNavigator/BottomTabNavigator';

const theme = {
  fontFamilyRegular: 'TmoneyRoundWindRegular',
  fontFamilyBold: 'TmoneyRoundWindExtraBold',
};

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
