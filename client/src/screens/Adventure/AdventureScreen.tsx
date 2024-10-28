import React, {useState} from 'react';
import {View, ImageBackground, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './AdventureScreen.styles';
import TtubeotProfile from '../../components/TtubeotProfile';
import StyledText from '../../styles/StyledText';
import AdventureMapScreen from './AdventureMapScreen';

const background = require('../../assets/images/AdventureBackground.jpg');
const woodenTexture = require('../../assets/images/WoodenSign.png');
const CameraIcon = require('../../assets/icons/CameraIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');

const AdventureScreen = () => {
  const [adventureStart, setAdventureStart] = useState<boolean>(false);
  const handleStartAdventure = () => {
    setAdventureStart(!adventureStart);
    console.log(adventureStart);
  };

  const handlePress = () => {
    console.log('ShopIcon pressed!');
  };

  // TODO: 컴포넌트 분리

  const renderPage = () => {
    if (adventureStart) {
      return <AdventureMapScreen />;
    } else {
      return (
        <ImageBackground source={woodenTexture} style={styles.alertBackground}>
          <View style={styles.adventureAlert}>
            <View style={styles.alertSection}>
              <StyledText bold style={styles.alertTitle}>
                모험을 떠나기 전에 꼭 확인해요!
              </StyledText>
            </View>
            <View style={styles.alertSection}>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  보물
                </StyledText>
                은{' '}
                <StyledText bold style={styles.accentText}>
                  공원 근처
                </StyledText>
                에서만 찾을 수 있어요
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                보물을{' '}
                <StyledText bold style={styles.accentText}>
                  발견
                </StyledText>
                하면,
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  진동
                </StyledText>
                으로 알려드릴테니 걱정 마세요
              </StyledText>
            </View>
            <View style={styles.alertSection}>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  위치정보
                </StyledText>
                를{' '}
                <StyledText bold style={styles.accentText}>
                  상대방에게 제공
                </StyledText>
                하는 것에,
              </StyledText>
              <StyledText bold style={styles.alertContent}>
                <StyledText bold style={styles.accentText}>
                  동의
                </StyledText>{' '}
                하셨습니다.
                <StyledText bold style={styles.accentTextBlue}>
                  {' '}
                  설정 바로가기
                </StyledText>
              </StyledText>
            </View>
          </View>
        </ImageBackground>
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.backgroundImage}></ImageBackground>
      <View style={styles.profileContainer}>
        <TtubeotProfile />
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
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartAdventure}>
        <View style={styles.buttonTextContainer}>
          <StyledText>임시버튼</StyledText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AdventureScreen;
