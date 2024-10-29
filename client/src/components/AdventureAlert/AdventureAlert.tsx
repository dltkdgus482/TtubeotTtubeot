import React, { useState } from 'react';
import { View, ImageBackground, Pressable } from 'react-native';
import StyledText from '../../styles/StyledText';
import styles from './AdventureAlert.styles';

const woodenTexture = require('../../assets/images/WoodenSign.png');

const AdventureAlert = () => {
  const [page, setPage] = useState<number>(1);

  const renderAlert = () => {
    if (page === 1) {
      return (
        <View style={styles.alertContainer}>
          <View style={styles.alertSection}>
            <StyledText bold style={styles.alertTitle}>
              뚜벗과 함께 떠나는 모험
            </StyledText>
          </View>
          <Pressable style={styles.alertSection} onPress={() => setPage(2)}>
            <StyledText bold style={styles.alertContent}>
              보물은 어떻게 찾아요?
            </StyledText>
          </Pressable>
          <Pressable style={styles.alertSection} onPress={() => setPage(3)}>
            <StyledText bold style={styles.alertContent}>
              친구는 어떻게 만나요?
            </StyledText>
          </Pressable>
        </View>
      );
    } else if (page === 2) {
      return (
        <View style={styles.alertContainer}>
          <View style={styles.alertSection}>
            <StyledText bold style={styles.alertTitle}>
              보물을 어떻게 찾냐면
            </StyledText>
          </View>
          <View style={styles.alertSection}>
            <Pressable onPress={() => setPage(1)}>
              <StyledText>뒤로가기</StyledText>
            </Pressable>
          </View>
        </View>
      );
    } else if (page === 3) {
      return (
        <View style={styles.alertContainer}>
          <View style={styles.alertSection}>
            <StyledText bold style={styles.alertTitle}>
              친구를 어떻게 만나냐면
            </StyledText>
          </View>
          <View style={styles.alertSection}>
            <Pressable onPress={() => setPage(1)}>
              <StyledText>뒤로가기</StyledText>
            </Pressable>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={woodenTexture} style={styles.alertBackground} />
      {renderAlert()}
    </View>
  );
};

export default AdventureAlert;
