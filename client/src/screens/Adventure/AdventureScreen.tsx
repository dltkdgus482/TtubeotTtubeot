import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
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

const { RnSensorStep, SystemUsage } = NativeModules;
const stepCounterEmitter = new NativeEventEmitter(RnSensorStep);

const background = require('../../assets/images/AdventureBackground.jpg');
const CameraIcon = require('../../assets/icons/CameraIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');

const isRunningOnEmulator = () => {
  if (Platform.OS === 'android') {
    const brand = Platform.constants?.Brand || '';
    return brand.toLowerCase() === 'google';
  }
  return false;
};

const AdventureScreen = () => {
  // setInterval(() => {
  //   SystemUsage.getSystemUsage()
  //     .then(data => {
  //       console.log('System Usage:', data);
  //     })
  //     .catch(error => {
  //       console.log('System Usage Error', error);
  //     });
  // }, 2000);

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

  const hasTreasure = useTreasureStore(state => state.hasTreasure);

  // ------------------------------

  const [steps, setSteps] = useState<number>(0);
  const [initialSteps, setInitialSteps] = useState<number>(0);

  useEffect(() => {
    const stepListener = stepCounterEmitter.addListener(
      'StepCounter',
      event => {
        if (initialSteps === null) {
          setInitialSteps(event.steps);
        } else {
          setSteps(event.steps - initialSteps);
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
      console.log('Permission denied');
      return;
    }

    setSteps(0);
    setInitialSteps(null);
    RnSensorStep.start(500, 'COUNTER');
  };

  const stopStepCounter = () => {
    RnSensorStep.stop();
    setSteps(0);
    setInitialSteps(null);
  };

  // ------------------------------

  useEffect(() => {
    setIsCameraOpen(false);
    setTimeout(() => {
      if (hasTreasure) {
        setIsTreasureOpen(true);
      }
    }, 500);
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
    connectSocket();
    startStepCounter();
  };

  const closeModal = () => {
    setModalVisible(false);
    setAdventureStart(!adventureStart);
    // setTimeout(() => {
    //   Animated.timing(opacityAnim, {
    //     toValue: adventureStart ? 0.65 : 0.3,
    //     duration: 500,
    //     useNativeDriver: true,
    //   }).start();
    // }, 100);
  };

  const handleStartAdventure = () => {
    if (!adventureStart) {
      // connectSocket();
      openModal();
      // startStepCounter();
    } else {
      disconnectSocket();
      closeModal();
      stopStepCounter();
    }
  };

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
      return <AdventureMapScreen steps={steps} />;
    } else {
      return <AdventureAlert />;
    }
  };

  let CameraModal;
  if (isCameraModalEnabled) {
    CameraModal = require('../../components/ARComponents/CameraModal').default;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={background}
        style={styles.backgroundImage}
        resizeMethod="resize"
      />
      {/* <Animated.Image
        source={background}
        style={[styles.backgroundImage, { opacity: opacityAnim }]}
      /> */}
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>
      <View style={styles.currencyContainer}>
        <CurrencyDisplay />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePressArButton}>
          <Image
            source={CameraIcon}
            style={styles.cameraIcon}
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
      <View style={styles.content}>{renderPage()}</View>
      <View style={styles.startButtonContainer}>
        <TouchableOpacity onPress={handleStartAdventure}>
          <ButtonDefault
            // content={steps.toString()}
            content={adventureStart ? 'STOP' : 'START'}
            iconSource={MapIcon}
            height={60}
            width={140}
            fontSize={20}
          />
        </TouchableOpacity>
      </View>
      <GPSAlertModal modalVisible={modalVisible} closeModal={closeModal} />

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
            closeModal={handleCloseTreasure}
          />
        ))}

      <MissionModal
        missionModalVisible={missionVisible}
        closeMissionModal={handleCloseMissionModal}
      />
    </SafeAreaView>
  );
};

export default AdventureScreen;
