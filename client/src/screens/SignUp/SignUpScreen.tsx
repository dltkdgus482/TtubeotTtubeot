import React from 'react';
import { View, TextInput, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './SignUpScreen.styles';
import StyledText from '../../styles/StyledText';
import ButtonDefault from '../../components/Button/ButtonDefault';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const SignUpScreen = () => {
  const navigation = useNavigation();

  const handleNextPress = () => {
    navigation.navigate('TermsOfUseScreen'); // '이용약관 페이지'로 이동
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.backgroundImage} />
      <View style={styles.titleContainer}>
        <Image source={title} style={styles.title} />
      </View>
      <View style={styles.withContainer}>
        <Image source={withTtubeot} style={styles.withTtubeot} />
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="이름을 입력해주세요"
          placeholderTextColor="#C7C7CD"
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.phoneInput}
            placeholder="휴대폰 번호를 숫자만 입력해주세요"
            placeholderTextColor="#C7C7CD"
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.requestButton}>
            <StyledText bold style={styles.requestButtonText}>인증 요청</StyledText>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="인증번호를 입력해주세요"
          placeholderTextColor="#C7C7CD"
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <ButtonDefault content="다음" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
