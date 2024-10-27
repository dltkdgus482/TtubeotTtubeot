import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './AdventureScreen.styles';
import TtubeotProfile from '../../styles/TtubeotProfile';

const background = require('../../assets/images/AdventureBackground.jpg');
const woodenTexture = require('../../assets/images/WoodenSign.png');

const AdventureScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.backgroundImage}></ImageBackground>
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>
      <View style={styles.content}>
        <ImageBackground source={woodenTexture} style={styles.alertBackground}>
          <View style={styles.adventureAlert}>
            <Text style={styles.alertContentTitle}>
              모험을 떠나기 전에 꼭 확인해요!
            </Text>
            <Text style={styles.alertContent}>
              길에서는 휴대폰을 보면 위험해요
            </Text>
            <Text style={styles.alertContent}>
              보물은 공원 근처에서만 찾을 수 있어요
            </Text>
            <Text style={styles.alertContent}>보물이 근처에 생기면,</Text>
            <Text style={styles.alertContent}>
              진동으로 알려드릴테니 걱정 마세요
            </Text>
            <Text style={styles.alertContentLast}>
              위치정보를 상대방에게 제공하는 것에,
            </Text>
            <Text style={styles.alertContent}>
              <Text style={{color: 'blue'}}>동의</Text> 하셨습니다.
            </Text>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default AdventureScreen;
