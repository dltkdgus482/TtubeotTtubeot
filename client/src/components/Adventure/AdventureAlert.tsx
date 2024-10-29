import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import StyledText from '../../styles/StyledText';
import styles from './AdventureAlert.styles';

const treasure = require('../../assets/icons/TreasureAlertIcon.png');
const friend = require('../../assets/icons/Friend.png');

const AdventureAlert = () => {
  const [page, setPage] = useState<number>(1);

  const renderAlert = () => {
    if (page === 1) {
      return (
        <View style={styles.alertContainer}>
          <StyledText bold style={styles.alertTitle}>
            모험에 대해 알려줄게 !
          </StyledText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setPage(2)}>
              <Image style={styles.buttonIcon} source={treasure} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setPage(3)}>
              <Image style={styles.buttonIcon} source={friend} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (page === 2) {
      return (
        <View style={styles.alertContainer}>
          <StyledText bold style={styles.alertTitle}>
            보물은 어떻게 찾냐면
          </StyledText>
          <StyledText>설명 적을 자리</StyledText>
          <TouchableOpacity onPress={() => setPage(1)}>
            <StyledText>뒤로가기</StyledText>
          </TouchableOpacity>
        </View>
      );
    } else if (page === 3) {
      return (
        <View style={styles.alertContainer}>
          <StyledText bold style={styles.alertTitle}>
            친구는 어떻게 만나냐면
          </StyledText>
          <StyledText>설명 적을 자리</StyledText>
          <TouchableOpacity onPress={() => setPage(1)}>
            <StyledText>뒤로가기</StyledText>
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.alertBackground}></View>
      <View style={styles.triangle}></View>
      {renderAlert()}
    </View>
  );
};

export default AdventureAlert;
