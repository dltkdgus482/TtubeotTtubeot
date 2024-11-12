import React, { useState, useEffect } from 'react';
import {
  View,
  ImageBackground,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './ProfileScreen.styles';
import StyledText from '../../styles/StyledText';
import Toggle from '../../components/Button/Toggle';
import CancelUserModal from '../../components/Profile/CancelUserModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../store/user';
import { logoutApi } from '../../utils/apis/users';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { modifyUserInfoApi } from '../../utils/apis/users';
import { RootStackParamList } from '../../types/navigationTypes';
import { profileColor, EmptyProfile } from '../../components/ProfileImageUrl';

const background = require('../../assets/images/IntroBackground.png');
const settings1 = require('../../assets/icons/SettingsIcon1.png');
const settings2 = require('../../assets/icons/SettingsIcon2.png');
const settings3 = require('../../assets/icons/SettingsIcon3.png');
const settings4 = require('../../assets/icons/SettingsIcon4.png');

type ProfileScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {
    user,
    ttubeotId,
    setUser,
    setAccessToken,
    setIsLoggedIn,
    accessToken,
    clearUser,
  } = useUser.getState();
  const [isGPSOn, setIsGPSOn] = useState<boolean>(!!user.userLocationAgreement);
  const [isPushOn, setIsPushOn] = useState<boolean>(
    !!user.userPushNotificationAgreement,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notFoundTtubeotId, setNotFoundTtubeotId] = useState<number>(1);

  useEffect(() => {
    setIsPushOn(!!user.userPushNotificationAgreement);
  }, [user.userPushNotificationAgreement]);

  useEffect(() => {
    setNotFoundTtubeotId(generateRandomNumber(1, 5));
  }, [ttubeotId]);

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handlePressGPSToggle = async () => {
    const newLocationAgreement = isGPSOn ? 0 : 1;

    setIsGPSOn(!isGPSOn); // 로컬 상태 업데이트

    try {
      const response = await modifyUserInfoApi(accessToken, setAccessToken, {
        user_location_agreement: newLocationAgreement,
      });

      if (response) {
        setUser({ ...user, userLocationAgreement: newLocationAgreement });
      }
    } catch (error) {
      console.error('위치 정보 동의 업데이트 실패:', error);
      Alert.alert(
        '위치 정보 동의 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handlePressPushToggle = () => {
    setNotFoundTtubeotId(prev => ((prev + 1) % 5) + 1);
    const newPushAgreement = isPushOn ? 0 : 1;
    setUser({
      ...user,
      userPushNotificationAgreement: newPushAgreement,
    });
    setIsPushOn(!isPushOn);
  };

  const handleLogout = async () => {
    try {
      await logoutApi(user.phoneNumber);
      clearUser(); // 로그아웃 후 사용자 상태 초기화
      Alert.alert('로그아웃 되었습니다.');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('FindPasswordScreen');
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
        {ttubeotId &&
          (ttubeotId === 46 ? (
            <View style={styles.profileNotFoundBackground}>
              <StyledText bold color="white" style={styles.notFound}>
                현재 보유 중인
              </StyledText>
              <StyledText bold color="white" style={styles.notFound}>
                뚜벗이 없어요
              </StyledText>
              <Image
                style={styles.profileNotFound}
                source={EmptyProfile[notFoundTtubeotId]}
              />
            </View>
          ) : (
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={profileColor[ttubeotId]}
              />
            </View>
          ))}
        <StyledText bold style={styles.nickName}>
          {user.userName} 님
        </StyledText>
      </View>
      <View style={styles.settingsContainer}>
        <ScrollView>
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
          <TouchableOpacity
            style={styles.cancelUser}
            onPress={handleCancelUser}>
            <View style={styles.cancelUserButton}>
              <StyledText style={styles.cancelUserText}>탈퇴하기</StyledText>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <CancelUserModal modalVisible={isModalOpen} closeModal={closeModal} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
