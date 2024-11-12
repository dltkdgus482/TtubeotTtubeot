import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import styles from './FirstSignUpScreen.styles';
import StyledText from '../../styles/StyledText';
import StyledTextInput from '../../styles/StyledTextInput';
import ButtonFlat from '../../components/Button/ButtonFlat';
import {
  requestSmsVerificationApi,
  confirmSmsVerificationApi,
  validatePhone,
} from '../../utils/apis/users/signup';
import { useUser } from '../../store/user';

interface FirstSignUpScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const FirstSignUpScreen: React.FC<FirstSignUpScreenProps> = ({
  onNext,
  onBack,
}) => {
  const user = useUser(state => state.user); // 현재 user 상태 가져오기
  const setUser = useUser(state => state.setUser); // 전체 user 객체를 설정하는 함수
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSmsConfirmed, setIsSmsConfirmed] = useState(false); // 인증 완료 여부 상태

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack(); // 뒤로가기 버튼 누르면 onBack 함수 호출
        return true; // 기본 뒤로가기 동작 막기
      },
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [onBack]);

  const handleNextPress = () => {
    if (!isSmsConfirmed) {
      Alert.alert('문자 인증을 완료해주세요.');
      return;
    }

    setUser({
      ...user,
      phoneNumber: phone,
    });
    console.log('유저', user);

    onNext();
  };

  const handleSmsRequest = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('휴대폰 번호는 10~11자리의 숫자를 입력해야 합니다.');
      return;
    }

    try {
      const response = await requestSmsVerificationApi(phone);
      if (response) {
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

    const response = await confirmSmsVerificationApi(phone, verificationCode);
    if (response) {
      setIsSmsConfirmed(true);
      Alert.alert('인증이 완료되었습니다.', '', [{ text: '확인' }]);
    } else {
      Alert.alert('인증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
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
          <TouchableOpacity
            style={styles.requestButton}
            onPress={handleSmsRequest}>
            <StyledText bold style={styles.requestButtonText}>
              인증 요청
            </StyledText>
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
            style={[
              styles.requestButton,
              isSmsConfirmed && styles.confirmedButton,
            ]}
            onPress={handleSmsConfirm}
            disabled={isSmsConfirmed}>
            <StyledText
              bold
              style={[
                styles.requestButtonText,
                isSmsConfirmed && styles.confirmedButtonText,
              ]}>
              {isSmsConfirmed ? '인증 완료' : '인증 확인'}
            </StyledText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextPress} // handleSmsConfirm에서 인증 성공 시 onNext 호출
          disabled={!verificationCode}>
          <ButtonFlat content="다음" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FirstSignUpScreen;
