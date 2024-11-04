import React, { useState } from 'react';
import { View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import defaultStyles from '../Auth/SignUpScreen.styles';
import styles from '../../components/Auth/FirstSignUpScreen.styles';
import StyledTextInput from '../../styles/StyledTextInput';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../../components/Button/ButtonFlat';
import { requestSmsVerificationApi, confirmSmsVerificationApi, validatePhone } from '../../utils/apis/users/signup';
import { useNavigation } from '@react-navigation/native';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const FindPasswordScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSmsConfirmed, setIsSmsConfirmed] = useState(false); // todo: 나중에 false 로

  const handleNextPress = () => {
    if (!isSmsConfirmed) {
      Alert.alert('문자 인증을 완료해주세요.');
      return;
    }

    navigation.navigate('SetNewPasswordScreen'); // 새 비밀번호 설정 페이지로 이동
  };

  const handleSmsRequest = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('휴대폰 번호는 10~11자리의 숫자를 입력해야 합니다.');
      return;
    }

    try {
      const success = await requestSmsVerificationApi(phone);
      if (success) {
        Alert.alert('문자 인증 요청이 성공적으로 전송되었습니다.');
      } else {
        Alert.alert('인증 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('인증 요청 중 에러 발생:', error);
      Alert.alert('인증 요청 중 오류가 발생했습니다.');
    }
  };

  const handleSmsConfirm = async () => {
    if (!verificationCode) {
      Alert.alert('인증번호를 입력해주세요.');
      return;
    }

    const success = await confirmSmsVerificationApi(phone, verificationCode);
    if (success) {
      setIsSmsConfirmed(true);
      Alert.alert('인증이 완료되었습니다.', '', [
        { text: '확인'},
      ]);
    } else {
      Alert.alert('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={defaultStyles.container}>
      <ImageBackground source={background} style={defaultStyles.backgroundImage} />
      <View style={defaultStyles.titleContainer}>
        <Image source={title} style={defaultStyles.title} />
      </View>
      <View style={defaultStyles.withContainer}>
        <Image source={withTtubeot} style={defaultStyles.withTtubeot} />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.phoneContainer}>
          <StyledTextInput
            style={styles.phoneInput}
            placeholder="휴대폰 번호를 숫자만 입력해주세요"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.requestButton} onPress={handleSmsRequest}>
            <StyledText bold style={styles.requestButtonText}>인증 요청</StyledText>
          </TouchableOpacity>
        </View>
        <View style={styles.phoneContainer}>
          <StyledTextInput
            style={styles.phoneInput}
            placeholder="인증번호를 입력해주세요"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <TouchableOpacity
            style={[styles.requestButton, isSmsConfirmed && styles.confirmedButton]}
            onPress={handleSmsConfirm}
            disabled={isSmsConfirmed}
          >
            <StyledText
              bold
              style={[styles.requestButtonText, isSmsConfirmed && styles.confirmedButtonText]}
            >
              {isSmsConfirmed ? '인증 완료' : '인증 확인'}
            </StyledText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextPress}
        >
          <ButtonFlat content="다음" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FindPasswordScreen;
