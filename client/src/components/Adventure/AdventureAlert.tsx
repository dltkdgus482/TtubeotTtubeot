import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import StyledText from '../../styles/StyledText';
import styles from './AdventureAlert.styles';
import ButtonFlat from '../Button/ButtonFlat';
import ButtonDefault from '../Button/ButtonDefault';

const treasure = require('../../assets/icons/TreasureAlertIcon.png');
const friend = require('../../assets/icons/Friend.png');
const addFriendIcon = require('../../assets/icons/addFriendIcon.png');
const cameraIcon = require('../../assets/icons/CameraIcon.png');

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
          <View style={styles.alertDescriptionContainer}>
            <StyledText bold style={styles.alertDescription}>
              공원 근처로 가서
            </StyledText>
            <StyledText bold style={styles.alertDescription}>
              일정 수 이상 걸음을 걸으면
            </StyledText>
            <View style={styles.alertDescriptionInnerContainer}>
              <Image
                source={cameraIcon}
                style={styles.cameraIcon}
                resizeMode="contain"
              />
              <StyledText bold style={styles.alertDescription}>
                보물탐지기로 찾을 수 있어 !
              </StyledText>
            </View>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setPage(1)}>
              <ButtonFlat content="뒤로가기" color="" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (page === 3) {
      return (
        <View style={styles.alertContainer}>
          <StyledText bold style={styles.alertTitle}>
            친구는 어떻게 만나냐면
          </StyledText>

          <View style={styles.alertDescriptionContainer}>
            <StyledText bold style={styles.alertDescription}>
              친구들과 만나서
            </StyledText>
            <View style={styles.alertDescriptionInnerContainer}>
              <Image
                source={addFriendIcon}
                style={styles.alertImage}
                resizeMode="contain"
              />
              <StyledText bold style={styles.alertDescription}>
                발자국 버튼을 눌러서
              </StyledText>
            </View>
            <StyledText bold style={styles.alertDescription}>
              친구 요청을 보내봐 !
            </StyledText>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setPage(1)}>
              <ButtonFlat content="뒤로가기" color="" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.alertBackground}>
        <View style={styles.triangle} />
        {renderAlert()}
      </View>
    </View>
  );
};

export default AdventureAlert;
