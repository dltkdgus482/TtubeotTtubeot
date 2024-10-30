import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  Pressable,
  Button,
  TouchableOpacity,
} from 'react-native';
import styles from './ProfileScreen.styles';
import StyledText from '../../styles/StyledText';
import Toggle from '../../components/Button/Toggle';
import CancelUserModal from '../../components/Profile/CancelUserModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const background = require('../../assets/images/IntroBackground.png');
const settings1 = require('../../assets/icons/SettingsIcon1.png');
const settings2 = require('../../assets/icons/SettingsIcon2.png');
const settings3 = require('../../assets/icons/SettingsIcon3.png');
const settings4 = require('../../assets/icons/SettingsIcon4.png');

const ProfileScreen = () => {
  const [isGPSOn, setIsGPSOn] = useState<boolean>(false);
  const [isPushOn, setIsPushOn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // TODO: 위치정보는 회원 db에 저장

  const handlePressGPSToggle = () => {
    setIsGPSOn(!isGPSOn);
  };

  // TODO: 상태관리

  const handlePressPushToggle = () => {
    setIsPushOn(!isPushOn);
  };

  const handleLogout = () => {
    // TODO: Logout logic
  };

  const handleChangePassword = () => {
    // TODO: Change password logic
  };

  const handleCancelUser = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={background} style={styles.backgroundContainer} />
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/icons/tempProfile.png')}
        />
        <StyledText bold style={styles.nickName}>
          참참참
        </StyledText>
      </View>
      <View style={styles.settingsContainer}>
        <View style={styles.settingsContent}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={styles.settingsIconContainer}>
              <Image source={settings1} style={styles.settingsIcon} />
            </View>
            <StyledText style={styles.settings}>
              위치정보 타인 제공 동의
            </StyledText>
          </View>
          <View>
            <Toggle onToggle={handlePressGPSToggle} isOn={isGPSOn} />
          </View>
        </View>
        <View style={styles.settingsContent}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={styles.settingsIconContainer}>
              <Image source={settings2} style={styles.settingsIcon} />
            </View>
            <StyledText style={styles.settings}>푸시알림</StyledText>
          </View>
          <View>
            <Toggle onToggle={handlePressPushToggle} isOn={isPushOn} />
          </View>
        </View>
        <View style={styles.settingsContent}>
          <Pressable
            style={{ display: 'flex', flexDirection: 'row' }}
            onPress={handleLogout}>
            <View style={styles.settingsIconContainer3}>
              <Image source={settings3} style={styles.settingsIcon3} />
            </View>
            <StyledText style={styles.settings}>로그아웃</StyledText>
          </Pressable>
        </View>
        <View style={styles.settingsContent}>
          <Pressable
            style={{ display: 'flex', flexDirection: 'row' }}
            onPress={handleChangePassword}>
            <View style={styles.settingsIconContainer}>
              <Image source={settings4} style={styles.settingsIcon} />
            </View>
            <StyledText style={styles.settings}>비밀번호 변경</StyledText>
          </Pressable>
        </View>
        <TouchableOpacity style={styles.cancelUser} onPress={handleCancelUser}>
          <View style={styles.cancelUserButton}>
            <StyledText color="#949494">탈퇴하기</StyledText>
          </View>
        </TouchableOpacity>
      </View>
      <CancelUserModal modalVisible={isModalOpen} closeModal={closeModal} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
