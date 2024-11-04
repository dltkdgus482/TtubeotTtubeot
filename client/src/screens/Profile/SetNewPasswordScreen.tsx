import React, { useState } from 'react';
import { View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import defaultStyles from '../Auth/SignUpScreen.styles';
import styles from './SetNewPasswordScreen.styles';
import StyledTextInput from '../../styles/StyledTextInput';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../../components/Button/ButtonFlat';
import { validatePassword } from '../../utils/apis/users/signup';
import { changePasswordApi } from '../../utils/apis/users/password';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../store/user';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const SetNewPasswordScreen = () => {
  const navigation = useNavigation();
  const user = useUser((state) => state.user);
  const { setAccessToken, accessToken } = useUser.getState();
  const [password, setPasswordInput] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const handleSetNewPassword = async () => {
    if (!validatePassword(password)) {
      Alert.alert('비밀번호는 영문자와 숫자를 포함한 6자 이상 15자 이하로 입력해야 합니다.');
      return;
    }
    if (password !== passwordCheck) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      // 비밀번호 변경 API 호출
      const success = await changePasswordApi(user.phoneNumber, password, accessToken, setAccessToken);
      if (success) {
        Alert.alert('비밀번호가 성공적으로 변경되었습니다.');
        navigation.navigate('ProfileScreen'); // ProfileScreen으로 이동
      } else {
        console.log(success);
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      Alert.alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
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
        <StyledTextInput
            style={defaultStyles.input}
            placeholder="새 비밀번호를 입력해주세요"
            placeholderTextColor="#C7C7CD"
            secureTextEntry
            value={password}
            onChangeText={setPasswordInput}
          />
          <StyledText style={styles.passwordHint}>영문, 숫자를 포함한 6 ~ 15자 조합으로 입력해 주세요.</StyledText>
          <StyledTextInput
            style={defaultStyles.input}
            placeholder="새 비밀번호를 한번 더 입력해주세요"
            placeholderTextColor="#C7C7CD"
            secureTextEntry
            value={passwordCheck}
            onChangeText={setPasswordCheck}
          />
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleSetNewPassword}
        >
          <ButtonFlat content="비밀번호 변경하기" color="#FDFBF4" width={170} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetNewPasswordScreen;
