import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import styles from './LastSignUpScreen.styles';
import defaulStyles from './FirstSignUpScreen.styles';
import StyledText from '../../styles/StyledText';
import StyledTextInput from '../../styles/StyledTextInput';
import ButtonFlat from '../../components/Button/ButtonFlat';
import { useUser } from '../../store/user';
import {
  signUpApi,
  userNameValidateApi,
  validatePassword,
} from '../../utils/apis/users/signup';
import { useNavigation } from '@react-navigation/native';

interface LastSignUpScreenProps {
  onBack: () => void;
}

const LastSignUpScreen: React.FC<LastSignUpScreenProps> = ({ onBack }) => {
  const navigation = useNavigation();
  const user = useUser(state => state.user); // 현재 user 상태 가져오기
  const setUser = useUser(state => state.setUser); // 전체 user 객체를 설정하는 함수

  const [userNameInput, setUserNameInput] = useState(user.userName || '');
  const [password, setPasswordInput] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isUserNameValid, setIsUserNameValid] = useState(false);

  // 닉네임 중복 확인 함수
  const handleCheckUserName = async () => {
    if (!userNameInput.trim()) {
      Alert.alert('닉네임을 입력해주세요.');
      return;
    }

    const isValid = await userNameValidateApi(userNameInput);
    setIsUserNameValid(isValid);
  };

  const handleSignUp = async () => {
    if (!isUserNameValid) {
      Alert.alert('닉네임 중복 확인을 먼저 해주세요.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        '비밀번호는 영문자와 숫자를 포함한 6자 이상 15자 이하로 입력해야 합니다.',
      );
      return;
    }
    if (password !== passwordCheck) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const formData = {
      userName: userNameInput,
      userPhone: user.phoneNumber,
      userPassword: password,
      userLocationAgreement: user.userLocationAgreement,
      userType: user.userType,
    };
    try {
      const response = await signUpApi(formData);
      if (response) {
        setUser({
          ...user,
          userName: userNameInput,
        });
        Alert.alert('회원가입이 완료되었습니다.');
        // console.log('회원가입 완료', user);
        // 회원가입 성공 시 인트로 스크린으로 이동
        navigation.navigate('IntroScreen');
      }
    } catch (error) {
      Alert.alert('회원 가입 중 오류가 발생했습니다.', error.message);
    }
  };

  return (
    <View style={defaulStyles.container}>
      <View style={defaulStyles.formContainer}>
        <View style={styles.nicknameContainer}>
          <StyledTextInput
            style={styles.nicknameInput}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor="#C7C7CD"
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
            value={userNameInput}
            onChangeText={text => {
              setUserNameInput(text);
              setIsUserNameValid(false);
            }}
          />
          <TouchableOpacity
            style={[
              styles.requestButton,
              isUserNameValid && defaulStyles.confirmedButton,
            ]}
            onPress={handleCheckUserName}
            disabled={isUserNameValid}>
            <StyledText
              bold
              style={[
                defaulStyles.requestButtonText,
                isUserNameValid && defaulStyles.confirmedButtonText,
              ]}>
              {isUserNameValid ? '확인 완료' : '중복 확인'}
            </StyledText>
          </TouchableOpacity>
        </View>
        <StyledText style={styles.nicknameHint}>
          한글 또는 영어로 이루어진 2 ~ 8자 조합으로 입력해 주세요.
        </StyledText>
        <StyledTextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={password}
          onChangeText={setPasswordInput}
        />
        <StyledText style={styles.passwordHint}>
          영문, 숫자를 포함한 6 ~ 15자 조합으로 입력해 주세요.
        </StyledText>
        <StyledTextInput
          style={styles.input}
          placeholder="비밀번호를 한번 더 입력해주세요"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
          value={passwordCheck}
          onChangeText={setPasswordCheck}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <ButtonFlat
            content="회원가입"
            color="#FDFBF4"
            width={120}
            height={50}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LastSignUpScreen;
