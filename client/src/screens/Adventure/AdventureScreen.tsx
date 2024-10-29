import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AdventureScreen.styles';
import TtubeotProfile from '../../components/TtubeotProfile';
import CurrencyDisplay from '../../components/CurrencyDisplay';
import AdventureMapScreen from './AdventureMapScreen';
import ButtonDefault from '../../components/Button/ButtonDefault';
import AdventureAlert from '../../components/AdventureAlert/AdventureAlert';

const background = require('../../assets/images/AdventureBackground.jpg');
const CameraIcon = require('../../assets/icons/CameraIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');

const AdventureScreen = () => {
  const [adventureStart, setAdventureStart] = useState<boolean>(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleStartAdventure = () => {
    setAdventureStart(!adventureStart);
    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: adventureStart ? 0.7 : 0.45,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const handlePress = () => {
    console.log('ShopIcon pressed!');
  };

  // TODO: 컴포넌트 분리

  const renderPage = () => {
    if (adventureStart) {
      return <AdventureMapScreen />;
    } else {
      return <AdventureAlert />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={background}
        style={[styles.backgroundImage, { opacity: opacityAnim }]}
      />
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>
      <View style={styles.currencyContainer}>
        <CurrencyDisplay />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={CameraIcon} style={styles.cameraIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Image source={MissionIcon} style={styles.missionIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{renderPage()}</View>
      <View style={styles.startButtonContainer}>
        <TouchableOpacity onPress={handleStartAdventure}>
          <ButtonDefault
            content={adventureStart ? 'STOP' : 'START'}
            iconSource={MapIcon}
            height={60}
            width={140}
            fontSize={20}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdventureScreen;
