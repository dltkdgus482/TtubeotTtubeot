import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Animated,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import StyledText from '../../styles/StyledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import styles from './JournalDetail.styles';
import ButtonFlat from '../../components/Button/ButtonFlat';
import AdventureRoute from '../../components/Journal/AdventureRoute';

type JournalDetailProps = {
  id: number;
  closeJournalDetail: () => void;
};

const flipIcon = require('../../assets/icons/FlipIcon.png');
const testPic = require('../../assets/images/MockTtubeotPicture.png');
const ttubeot = require('../../assets/images/TtubeotTitle.png');
const mockTtu = require('../../assets/ttubeot/IntroTtubeotDog.png');

const JournalDetail = ({ id, closeJournalDetail }: JournalDetailProps) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [isFrontView, setIsFrontView] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const listenerId = flipAnimation.addListener(({ value }) => {
      if (value >= 0.5 && isFrontView) {
        setIsFrontView(false);
      } else if (value < 0.5 && !isFrontView) {
        setIsFrontView(true);
      }
    });

    return () => {
      flipAnimation.removeListener(listenerId);
    };
  }, [isFrontView, flipAnimation]);

  const flipContainer = () => {
    Animated.timing(flipAnimation, {
      toValue: isFrontView ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: [1, 0.9, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0.9, 1],
  });

  const frontRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const backRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const openRouteModal = () => {
    setIsModalOpen(true);
  };

  const closeRouteModal = () => {
    setIsModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundCircle} />
      <TouchableOpacity onPress={flipContainer}>
        <Image style={styles.flipButton} source={flipIcon} />
      </TouchableOpacity>
      <Animated.View style={[styles.shadow, { opacity: frontOpacity }]} />
      {isFrontView ? (
        <Animated.View
          style={[
            styles.outerContainer,
            { opacity: frontOpacity, transform: [{ rotateY: frontRotateY }] },
          ]}>
          <View style={styles.frontView}>
            <View style={styles.titleContainer}>
              <Image
                source={ttubeot}
                style={styles.title}
                resizeMode="contain"
              />
              <Image source={mockTtu} style={styles.titleTtubeot} />
            </View>
            <View style={styles.pictureContainer}>
              <Image source={testPic} style={styles.picture} />
              <Image source={testPic} style={styles.picture} />
              <Image source={testPic} style={styles.picture} />
              <Image source={testPic} style={styles.picture} />
            </View>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.outerContainer,
            { opacity: backOpacity, transform: [{ rotateY: backRotateY }] },
          ]}>
          <View style={styles.backView}>
            <View style={styles.journalTitleContainer}>
              <StyledText bold style={styles.journalTitle}>
                우리마루<StyledText>와 함께한</StyledText>
              </StyledText>
              <StyledText bold style={styles.journalTitle}>
                2024 / 10 / 30일<StyledText>의 모험 일지</StyledText>
              </StyledText>
            </View>
            <View style={styles.journalContentContainer}>
              <View style={styles.journalDetailSection}>
                <Icon type="Ionicons" name="time" size={25} color="#A5C168" />
                <StyledText style={styles.journalDetail}>
                  총 모험 시간
                </StyledText>
                <StyledText style={styles.journalDetail}>45 분</StyledText>
              </View>
              <View style={styles.journalDetailSection}>
                <Icon
                  type="FontAwesome5"
                  name="paw"
                  size={25}
                  color="#A5C168"
                />
                <StyledText style={styles.journalDetail}>3,720 걸음</StyledText>
                <StyledText style={styles.journalDetail}>약 50 kcal</StyledText>
              </View>
              <View style={styles.journalDetailSection}>
                <Icon
                  type="FontAwesome5"
                  name="user-friends"
                  size={25}
                  color="#A5C168"
                />
                <StyledText style={styles.journalDetail}>
                  새로운 친구
                </StyledText>
                <StyledText style={styles.journalDetail}>1 명</StyledText>
              </View>
              <View style={styles.journalDetailSection}>
                <Icon
                  type="FontAwesome5"
                  name="route"
                  size={25}
                  color="#A5C168"
                />
                <StyledText style={styles.journalDetail}>
                  모험 경로 확인
                </StyledText>
                <Pressable onPress={openRouteModal}>
                  <StyledText color="#7C92B3" style={styles.journalDetailMap}>
                    확인하기
                  </StyledText>
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.returnButton}
        onPress={closeJournalDetail}>
        <ButtonFlat content="돌아가기" />
      </TouchableOpacity>

      <AdventureRoute modalVisible={isModalOpen} closeModal={closeRouteModal} />
    </SafeAreaView>
  );
};

export default JournalDetail;
