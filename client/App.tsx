import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigator/BottomTabNavigator/BottomTabNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import FirstSignUpScreen from './src/components/Auth/FirstSignUpScreen';
import TermsOfUseScreen from './src/components/Auth/TermsOfUseScreen';
import LastSignUpScreen from './src/components/Auth/LastSignUpScreen';
import IntroScreen from './src/screens/IntroScreen';
import { useUser } from './src/store/user';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import FindPasswordScreen from './src/screens/Profile/FindPasswordScreen';
import SetNewPasswordScreen from './src/screens/Profile/SetNewPasswordScreen';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import useTreasureStore from './src/store/treasure';

const Stack = createStackNavigator();

const theme = {
  fontFamilyRegular: 'TmoneyRoundWindRegular',
  fontFamilyBold: 'TmoneyRoundWindExtraBold',
};

function App(): React.JSX.Element {
  const setupNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  };

  const requestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();
  };

  useEffect(() => {
    setupNotificationChannel();

    requestNotificationPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { notification } = remoteMessage;

      if (notification) {
        await notifee.displayNotification({
          title: notification?.title || '알림 제목',
          body: notification?.body || '알림 내용',
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
          },
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const resetTreasureCount = async () => {
      await useTreasureStore.getState().checkAndResetTreasureCount();
      // console.log(
      //   '오늘 보물 찾은 횟수',
      //   useTreasureStore.getState().treasureCount,
      // );
    };
    resetTreasureCount();
  }, []);

  const { isLoggedIn } = useUser();

  // console.log(isLoggedIn);
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          translucent
          backgroundColor="#F2F2F2"
          barStyle="dark-content"
        />
        {isLoggedIn ? (
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="IntroScreen"
                component={IntroScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FindPasswordScreen"
                component={FindPasswordScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SetNewPasswordScreen"
                component={SetNewPasswordScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
