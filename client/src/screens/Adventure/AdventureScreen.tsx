import React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './AdventureScreen.styles';
import TtubeotProfile from '../../styles/TtubeotProfile';
import StyledText from '../../styles/StyledText';

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
              <StyledText bold style={styles.alertTitle}>
                모험을 떠나기 전에 꼭 확인해요!
              </StyledText>
            </View>
            <View style={styles.alertSection}>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  보물
                </StyledText>
                은{' '}
                <StyledText bold style={styles.accentText}>
                  공원 근처
                </StyledText>
                에서만 찾을 수 있어요
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                보물을{' '}
                <StyledText bold style={styles.accentText}>
                  발견
                </StyledText>
                하면,
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  진동
                </StyledText>
                으로 알려드릴테니 걱정 마세요
              </StyledText>
            </View>
            <View style={styles.alertSection}>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  위치정보
                </StyledText>
                를{' '}
                <StyledText bold style={styles.accentText}>
                  상대방에게 제공
                </StyledText>
                하는 것에,
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  동의
                </StyledText>{' '}
                하셨습니다.
                <StyledText bold style={styles.accentTextBlue}>
                  {' '}
                  설정 바로가기
                </StyledText>
              </StyledText>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default AdventureScreen;
