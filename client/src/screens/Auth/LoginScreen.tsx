import React, { useState } from 'react';
import { View, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import defaultStyles from './SignUpScreen.styles';
import styles from './LoginScreen.styles';
import StyledTextInput from '../../styles/StyledTextInput';
import ButtonFlat from '../../components/Button/ButtonFlat';
import { loginApi, getInfoApi } from '../../utils/apis/users';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../store/user';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const LoginScreen = () => {
  const user = useUser((state) => state.user); // 현재 user 상태 가져오기
  const { setAccessToken, setIsLoggedIn, setUser } = useUser.getState();
  const [phone, setPhone] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!phone || !passwordInput) {
      Alert.alert('휴대폰 번호와 비밀번호를 입력해주세요.');
      return;
    }

    const formData = {
      id: phone,
      password: passwordInput,
    };

    try {
      // 로그인 API 호출
      const userId = await loginApi(formData, setAccessToken, setIsLoggedIn);

      if (userId) {
        const currentAccessToken = useUser.getState().accessToken;

        if (!currentAccessToken) {
          Alert.alert('액세스 토큰을 가져오지 못했습니다. 다시 로그인해주세요.');
          return;
        }

        // 프로필 정보 조회
        const userInfo = await getInfoApi(currentAccessToken, setAccessToken);
  
        // 프로필 정보로 사용자 상태 업데이트
        setUser({
          userId: userId,
          userName: userInfo.user_name,
          phoneNumber: userInfo.user_phone,
          userLocationAgreement: userInfo.user_location_agreement,
          userPushNotificationAgreement: user.userPushNotificationAgreement, // 상태에 저장되어 있던 값 그대로
          userType: 0, // 기본값 (자녀/부모 등 사용자 유형)
          goal: userInfo.user_goal,
          coin: userInfo.user_coin,
          userParent: userInfo.user_parent,
        });

        // 상태 변경 후 확인
        console.log('Updated user state:', useUser.getState().user);

        // 홈 화면으로 이동
        navigation.navigate('IntroScreen');
      }
    } catch (error) {
      Alert.alert(error.message);
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
          style={styles.input}
          placeholder="휴대폰 번호를 입력해주세요"
          placeholderTextColor="#C7C7CD"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <StyledTextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={passwordInput}
          onChangeText={setPasswordInput}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ButtonFlat content="로그인" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
