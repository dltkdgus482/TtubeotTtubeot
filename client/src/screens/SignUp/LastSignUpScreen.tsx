import React from 'react';
import { View, TextInput, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './LastSignUpScreen.styles';
import defaulStyles from './SignUpScreen.styles';
import StyledText from '../../styles/StyledText';
import ButtonDefault from '../../components/Button/ButtonDefault';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const LastSignUpScreen = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.navigate('HomeScreen'); // 회원가입 성공 후 홈스크린으로 이동
  };

  return (
    <View style={defaulStyles.container}>
      <ImageBackground source={background} style={defaulStyles.backgroundImage} />
      <View style={defaulStyles.titleContainer}>
        <Image source={title} style={defaulStyles.title} />
      </View>
      <View style={defaulStyles.withContainer}>
        <Image source={withTtubeot} style={defaulStyles.withTtubeot} />
      </View>

      <View style={defaulStyles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="닉네임을 입력해주세요"
          placeholderTextColor="#C7C7CD"
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
        />
        <StyledText style={styles.passwordHint}>영문, 숫자를 포함한 6 ~ 15자 조합으로 입력해 주세요.</StyledText>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 한번 더 입력해주세요"
          placeholderTextColor="#C7C7CD"
          secureTextEntry
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <ButtonDefault content="회원가입" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LastSignUpScreen;
