import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import styles from './IntroScreen.styles';
import ButtonDefault from '../components/Button/ButtonDefault';
import { useUser } from '../store/user';
import { useNavigation } from '@react-navigation/native';

const background = require('../assets/images/IntroBackground.png');
const title = require('../assets/images/TtubeotTitle.png');
const withTtubeot = require('../assets/images/WithTtubeot.png');
const dog = require('../assets/ttubeot/IntroTtubeotDog.png');
const rabbit = require('../assets/ttubeot/IntroTtubeotRabbit.png');
const hippo = require('../assets/ttubeot/IntroTtubeotHippo.png');
const penguin = require('../assets/ttubeot/IntroTtubeotPenguin.png');
const rhinoceros = require('../assets/ttubeot/IntroTtubeotRhinoceros.png');
const sheep = require('../assets/ttubeot/IntroTtubeotSheep.png');

const IntroScreen = () => {
  const navigation = useNavigation();
  const {setIsLoggedIn} = useUser();

  const sheepAnim = useRef(new Animated.Value(500)).current;
  const dogAnim = useRef(new Animated.Value(500)).current;
  const penguinAnim = useRef(new Animated.Value(500)).current;
  const rhinoAnim = useRef(new Animated.Value(500)).current;
  const hippoAnim = useRef(new Animated.Value(500)).current;
  const rabbitAnim = useRef(new Animated.Value(500)).current;
  const titleAnim = useRef(new Animated.Value(-500)).current;
  const withAnim = useRef(new Animated.Value(-1000)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(sheepAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dogAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(penguinAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rhinoAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(hippoAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rabbitAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(withAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.background} />
      <Animated.View
        style={[
          styles.titleContainer,
          { transform: [{ translateY: titleAnim }] },
        ]}>
        <Image source={title} style={styles.title} />
      </Animated.View>
      <Animated.View
        style={[
          styles.withContainer,
          { transform: [{ translateY: withAnim }] },
        ]}>
        <Image source={withTtubeot} style={styles.withTtubeot} />
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, { opacity: buttonAnim }]}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <ButtonDefault content="로그인" height={50} width={120} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <ButtonDefault content="회원가입" height={50} width={120} />
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.ttubeotContainer}>
        <Animated.View
          style={[
            styles.sheepContainer,
            { transform: [{ translateY: sheepAnim }] },
          ]}>
          <Image source={sheep} style={styles.sheep} />
        </Animated.View>
        <Animated.View
          style={[
            styles.dogContainer,
            { transform: [{ translateY: dogAnim }] },
          ]}>
          <Image source={dog} style={styles.dog} />
        </Animated.View>
        <Animated.View
          style={[
            styles.penguinContainer,
            { transform: [{ translateY: penguinAnim }] },
          ]}>
          <Image source={penguin} style={styles.penguin} />
        </Animated.View>
        <Animated.View
          style={[
            styles.rhinocerosContainer,
            { transform: [{ translateY: rhinoAnim }] },
          ]}>
          <Image source={rhinoceros} style={styles.rhinoceros} />
        </Animated.View>
        <Animated.View
          style={[
            styles.hippoContainer,
            { transform: [{ translateY: hippoAnim }] },
          ]}>
          <Image source={hippo} style={styles.hippo} />
        </Animated.View>
        <Animated.View
          style={[
            styles.rabbitContainer,
            { transform: [{ translateY: rabbitAnim }] },
          ]}>
          <Image source={rabbit} style={styles.rabbit} />
        </Animated.View>
      </View>
    </View>
  );
};

export default IntroScreen;
