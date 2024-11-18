import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useCameraPermission } from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './AdventureScreen.styles';
import TtubeotProfile from '../../components/TtubeotProfile';
import CurrencyDisplay from '../../components/CurrencyDisplay';
import AdventureMapScreen from '../../components/Adventure/AdventureMapScreen';
import ButtonDefault from '../../components/Button/ButtonDefault';
import AdventureAlert from '../../components/Adventure/AdventureAlert';
import GPSAlertModal from '../../components/Adventure/GPSAlertModal';
import useAdventureSocket from '../../utils/apis/adventure/AdventureInit';
import MissionModal from '../../components/Mission/MissionModal';
import useTreasureStore from '../../store/treasure';
import GetTreasureModal from '../../components/ARComponents/GetTreasureModal';
import StyledTextInput from '../../styles/StyledTextInput';
import ButtonFlat from '../../components/Button/ButtonFlat';
import WebView from 'react-native-webview';
import { useUser } from '../../store/user';
import { updateStepMission } from '../../utils/apis/Mission/updateMissionInfo';
import StyledText from '../../styles/StyledText';
import { updateLog } from '../../utils/apis/updateLog';
import useAdventureStore from '../../store/adventure';
import { getTtubeotDetail } from '../../utils/apis/users/userTtubeot';

const { RnSensorStep, SystemUsage } = NativeModules;
const stepCounterEmitter = new NativeEventEmitter(RnSensorStep);

const background = require('../../assets/images/AdventureBackground.jpg');
const CameraIcon = require('../../assets/icons/CameraIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');
const horseBalloon = require('../../assets/images/horseBalloon.png');

const isRunningOnEmulator = () => {
  if (Platform.OS === 'android') {
    const brand = Platform.constants?.Brand || '';
    return brand.toLowerCase() === 'google';
  }
  return false;
};

const AdventureScreen = () => {
  const isFocused = useIsFocused();
  const { ttubeotId, user, setUser } = useUser.getState();
  const [adventureStart, setAdventureStart] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [missionVisible, setMissionVisible] = useState<boolean>(false);
  const [isCameraModalEnabled, setIsCameraModalEnabled] =
    useState<boolean>(false);
  // const opacityAnim = useRef(new Animated.Value(0.65)).current;
  const { connectSocket, disconnectSocket } = useAdventureSocket();

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isARMode, setIsARMode] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const [isTreasureOpen, setIsTreasureOpen] = useState<boolean>(false);

  const { hasTreasure, nearbyTreasure, currentReward } = useTreasureStore();

  const [isPressedNextButton, setIsPressedNextButton] =
    useState<boolean>(false);

  const webViewRef = useRef(null);
  const [inputValue, setInputValue] = useState('1');
  // ------------------------------

  const [steps, setSteps] = useState<number>(0);
  const [initialSteps, setInitialSteps] = useState<number>(0);
  const { accessToken, setAccessToken } = useUser.getState();

  const [horseBalloonContent, setHorseBalloonContent] =
    useState<string>('친구 발견');
  const [horseBalloonVisible, setHorseBalloonVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUserTtubeot = async () => {
      const res = await getTtubeotDetail(
        user.userId,
        accessToken,
        setAccessToken,
      );
      setUser({ ...user, steps: res.ttubeotScore });
    };
    fetchUserTtubeot();
  }, []);

  useEffect(() => {
    const stepListener = stepCounterEmitter.addListener(
      'StepCounter',
      event => {
        if (initialSteps === null) {
          setInitialSteps(event.steps);
        } else {
          setSteps(event.steps - initialSteps);
          // setSteps(0);
        }
      },
    );

    return () => {
      stepListener.remove();
    };
  }, [initialSteps]);

  const startStepCounter = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Permission denied');
      return;
    }

    setSteps(0);
    setInitialSteps(null);
    RnSensorStep.start(500, 'COUNTER');
  };

  const stopStepCounter = () => {
    // 서버에 미션 갱신 요청

    RnSensorStep.stop();
    setSteps(0);
    setInitialSteps(null);
  };

  // ------------------------------

  useEffect(() => {
    if (hasTreasure) {
      setIsTreasureOpen(true);
      setIsCameraOpen(false);
    }
  }, [hasTreasure]);

  useEffect(() => {
    const emulatorCheck = isRunningOnEmulator();
    setIsCameraModalEnabled(!emulatorCheck);
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };
    requestPermissions();
  }, [hasPermission]);

  const openModal = () => {
    setModalVisible(true);
    // connectSocket();
    // startStepCounter();
  };

  const closeModal = () => {
    setModalVisible(false);
    // disconnectSocket();
    // stopStepCounter();
  };

  useEffect(() => {
    setUser({ ...user, steps: user.steps + 1 });
  }, [steps]);

  const handleStartAdventure = () => {
    if (!adventureStart) {
      openModal();
      // connectSocket();
      // startStepCounter();
    } else {
      updateStepMission(accessToken, setAccessToken, steps);
      // 로그 업데이트 로직 추가
      updateLog(accessToken, setAccessToken, 2);
      disconnectSocket();
      stopStepCounter();
      setIsPressedNextButton(false);
      setAdventureStart(false);
    }
  };

  const [loading, setLoading] = useState(true);
  const { socketConnected } = useAdventureStore();

  useEffect(() => {
    if (isPressedNextButton) {
      connectSocket();
      startStepCounter();
      setAdventureStart(true);
    } else {
      setAdventureStart(false);
      setLoading(true);
      // disconnectSocket();
      // stopStepCounter();
    }
  }, [isPressedNextButton]);

  useEffect(() => {
    if (socketConnected) {
      setLoading(false);
    }
  }, [socketConnected]);

  useEffect(() => {
    // console.log('보물 찾음?', nearbyTreasure, currentReward);
    const openAR = async () => {
      if (hasPermission) {
        setIsARMode(true);
        setIsCameraOpen(true);
      } else {
        await requestPermission();
      }
    };
    if (nearbyTreasure && currentReward > 0) {
      openAR();
    }
  }, [nearbyTreasure, currentReward]);

  const handlePressArButton = async () => {
    if (hasPermission) {
      setIsARMode(true);
      setIsCameraOpen(true);
    } else {
      await requestPermission();
    }
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setIsARMode(false);
  };

  const handlePressMissionModal = () => {
    setMissionVisible(true);
  };

  const handleCloseMissionModal = () => {
    setMissionVisible(false);
  };

  const handleCloseTreasure = () => {
    setIsTreasureOpen(false);
  };

  const renderPage = () => {
    if (adventureStart) {
      return loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      ) : (
        <AdventureMapScreen
          steps={steps}
          horseBalloonVisible={horseBalloonVisible}
          setHorseBalloonVisible={setHorseBalloonVisible}
          setHorseBalloonContent={setHorseBalloonContent}
        />
      );
    } else {
      return <AdventureAlert />;
    }
  };

  let CameraModal;
  if (isCameraModalEnabled) {
    CameraModal = require('../../components/ARComponents/CameraModal').default;
  }

  const sendId = (id: number) => {
    if (webViewRef.current && id > 0 && id <= 46) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'changeId', id }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      sendId(ttubeotId);
      setModalVisible(false);
    }, [ttubeotId]),
  );
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={background}
        style={styles.backgroundImage}
        resizeMethod="resize"
      />
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>
      <View style={styles.currencyContainer}>
        <CurrencyDisplay />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePressArButton}
          disabled={!nearbyTreasure && currentReward === 0}>
          <Image
            source={CameraIcon}
            style={[
              styles.cameraIcon,
              !nearbyTreasure && currentReward === 0 && styles.disabledCamera,
            ]}
            resizeMethod="resize"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressMissionModal}>
          <Image
            source={MissionIcon}
            style={styles.missionIcon}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.content, { opacity: isTreasureOpen ? 0 : 1 }]}>
        {renderPage()}
      </View>
      {/* <View style={[styles.content, { opacity: modalVisible ? 0 : 1 }]}>
        {renderPage()}
      </View> */}
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
      <GPSAlertModal
        modalVisible={modalVisible}
        setIsPressedNextButton={setIsPressedNextButton}
        closeModal={closeModal}
      />
      <View style={styles.ttubeotWebviewContainer} pointerEvents="none">
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ uri: 'file:///android_asset/renderRunModel.html' }}
          style={styles.ttubeotWebview}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          onLoadStart={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            // console.log('WebView Start: ', nativeEvent);
          }}
          onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView onError: ', nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView onHttpError: ', nativeEvent);
          }}
          onMessage={event => {
            // console.log('Message from WebView:', event.nativeEvent.data);
          }}
        />

        {horseBalloonVisible && (
          <View style={styles.horseBalloonContainer}>
            <Image source={horseBalloon} style={styles.horseBalloon} />
            <StyledText bold style={styles.horseBalloonText}>
              {horseBalloonContent}
            </StyledText>
          </View>
        )}
      </View>

      {isCameraModalEnabled &&
        CameraModal &&
        (!hasTreasure ? (
          <CameraModal
            modalVisible={isCameraOpen}
            closeModal={handleCloseCamera}
            isARMode={isARMode}
          />
        ) : (
          <GetTreasureModal
            modalVisible={isTreasureOpen}
            ttubeotId={ttubeotId}
            closeModal={handleCloseTreasure}
          />
        ))}

      <MissionModal
        missionModalVisible={missionVisible}
        closeMissionModal={handleCloseMissionModal}
      />
      {/* <GetTreasureModal
        modalVisible={modalVisible}
        ttubeotId={ttubeotId}
        closeModal={closeModal}
      /> */}
    </SafeAreaView>
  );
};

export default AdventureScreen;
