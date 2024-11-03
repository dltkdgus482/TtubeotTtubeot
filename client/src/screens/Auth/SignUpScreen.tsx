import React, { useState } from 'react';
import { View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import styles from './SignUpScreen.styles';
import ButtonFlat from '../../components/Button/ButtonFlat';
import TermsOfUseScreen from '../../components/Auth/TermsOfUseScreen';
import FirstSignUpScreen from '../../components/Auth/FirstSignUpScreen';
import LastSignUpScreen from '../../components/Auth/LastSignUpScreen';
import StyledText from '../../styles/StyledText';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const SignUpScreen = () => {
  const [step, setStep] = useState(1); // 현재 회원가입 단계
  const onNext = () => {
    setStep(prev => prev + 1);
    console.log('step', step);
  };
  const onBack = () => {
    setStep(prev => prev - 1);
  };

const renderFormContainer = () => {
    switch (step) {
      case 1:
        return <TermsOfUseScreen onNext={onNext} />;
      case 2:
        return <FirstSignUpScreen onNext={onNext} onBack={onBack} />;
      case 3:
        return <LastSignUpScreen onBack={onBack} />;
      default:
        return null;
    }
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
      <View style={styles.formContainer}>{renderFormContainer()}</View>
    </View>
  );
};

export default SignUpScreen;
