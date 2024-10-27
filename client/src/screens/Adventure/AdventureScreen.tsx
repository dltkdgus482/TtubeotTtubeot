import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
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
            <View style={styles.alertSection}>
              <Text style={styles.alertTitle}>
                모험을 떠나기 전에 꼭 확인해요!
              </Text>
            </View>
            <View style={styles.alertSection}>
              <Text style={styles.alertContent}>
                <Text style={styles.accentText}>보물</Text>은{' '}
                <Text style={styles.accentText}>공원 근처</Text>에서만 찾을 수
                있어요
              </Text>
              <Text style={styles.alertContent}>
                보물을 <Text style={styles.accentText}>발견</Text>
                하면,
              </Text>
              <Text style={styles.alertContent}>
                <Text style={styles.accentText}>진동</Text>으로 알려드릴테니
                걱정 마세요
              </Text>
            </View>
            <View style={styles.alertSection}>
              <Text style={styles.alertContent}>
                <Text style={styles.accentText}>위치정보</Text>를{' '}
                <Text style={styles.accentText}>상대방에게 제공</Text>하는 것에,
              </Text>
              <Text style={styles.alertContent}>
                <Text style={styles.accentText}>동의</Text> 하셨습니다.
                <Text style={styles.accentTextBlue}> 설정 바로가기</Text>
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default AdventureScreen;
