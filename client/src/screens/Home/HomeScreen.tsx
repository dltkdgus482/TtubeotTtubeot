import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import styles from './HomeScreen.styles';
import TtubeotProfile from '../../components/TtubeotProfile';
import CurrencyDisplay from '../../components/CurrencyDisplay.tsx';
import CharacterShopModal from '../../components/CharacterShop/CharacterShopModal';
import AlbumModal from '../../components/Album/AlbumModal';
import MissionModal from '../../components/Mission/MissionModal.tsx';
import WebView from 'react-native-webview';
import ButtonDefault from '../../components/Button/ButtonDefault.tsx';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsModal from '../../components/Friends/FriendsModal.tsx';
import BLE from '../../components/BLE/BLEModal.tsx';
import BLEModal from '../../components/BLE/BLEModal.tsx';
import StyledTextInput from '../../styles/StyledTextInput.ts';
import StyledText from '../../styles/StyledText.ts';
import ButtonFlat from '../../components/Button/ButtonFlat.tsx';
import { useUser } from '../../store/user.ts';
import {
  getTtubeotDetail,
  getTtubeotStatus,
  getTtubeotInterestApi,
} from '../../utils/apis/users/userTtubeot.ts';
import { getInfoApi } from '../../utils/apis/users/index.ts';
import AffectionDisplay from '../../components/AffectionDisplay.tsx';
import { updateLog } from '../../utils/apis/updateLog.ts';
import WarningModal from '../../components/CharacterShop/WarningModal.tsx';

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');
const FriendIcon = require('../../assets/icons/FriendIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');
const horseBalloon = require('../../assets/images/horseBalloon2.png');
const PawIcon = require('../../assets/icons/3dPawIcon.png'); // 심심할 때
const HeartIcon = require('../../assets/icons/3dHeartIcon.png'); // 관심지수 80% 이상일 때
const HungryIcon = require('../../assets/icons/3dHungryIcon.png'); // 배고플 때
const meetingTtubeotButton = require('../../assets/icons/meetingTtubeotButton.png');

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const {
    user,
    setUser,
    accessToken,
    setAccessToken,
    ttubeotId,
    setTtubeotId,
  } = useUser.getState();
  const [modalVisible, setModalVisible] = useState(false);
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [missionModalVisible, setMissionModalVisible] = useState(false);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const navigation = useNavigation();
  const [BLEModalVisible, setBLEModalVisible] = useState(false);
  const [ttubeotStatus, setTtubeotStatus] = useState<number | null>(null);
  const [affectionPoints, setAffectionPoints] = useState<number>(0);
  const [currentTtubeotStatus, setCurrentTtubeotStatus] = useState<number>(2); // 기본은 정상 상태로
  const [horseBalloonVisible, setHorseBalloonVisible] =
    useState<boolean>(false);
  const [horseBalloonContent, setHorseBalloonContent] =
    useState<ImageSourcePropType>(null);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [webviewOpacity, setWebviewOpacity] = useState<number>(0);
  const [nowSpinning, setNowSpinning] = useState<boolean>(false);

  const webViewRef = useRef(null);

  const openShopModal = () => {
    if (ttubeotId !== 46) {
      setWarningModalVisible(true);
      setTimeout(() => {
        setWarningModalVisible(false);
      }, 2500);
    }
    setModalVisible(true);
  };

  const closeShopModal = () => {
    setModalVisible(false);
  };

  const openAlbumModal = () => {
    setAlbumModalVisible(true);
  };

  const closeAlbumModal = () => {
    setAlbumModalVisible(false);
  };

  const openMissionModal = () => {
    setMissionModalVisible(true);
  };

  const closeMissionModal = () => {
    setMissionModalVisible(false);
  };

  const openFriendsModal = () => {
    setFriendsModalVisible(true);
  };

  const closeFriendsModal = () => {
    setFriendsModalVisible(false);
  };

  const openBLEModal = () => {
    setBLEModalVisible(true);
  };

  const closeBLEModal = () => {
    setBLEModalVisible(false);
  };

  const handleBalloonPress = async () => {
    if (currentTtubeotStatus === 0) {
      await updateLog(accessToken, setAccessToken, 0);
      // console.log('로그 추가 api 호출완');
      fetchInterestInfo();
    }

    if (currentTtubeotStatus === 0 || affectionPoints >= 80) {
      if (!nowSpinning) {
        setNowSpinning(true);
        setTimeout(() => {
          setNowSpinning(false);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    // setWebviewOpacity(0);
    if (nowSpinning) {
      sendId(ttubeotId + 100);
      // setTimeout(() => {
      //   setWebviewOpacity(1);
      // }, 300);
    } else {
      setTimeout(() => {
        sendId(ttubeotId);
        // setTimeout(() => {
        //   setWebviewOpacity(1);
        // }, 300);
      }, 200);
    }
  }, [nowSpinning]);

  useEffect(() => {
    if (currentTtubeotStatus === 0) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent(HungryIcon); // 배고픔
    } else if (currentTtubeotStatus === 1) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent(PawIcon); // 심심함
    } else if (affectionPoints >= 80) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent(HeartIcon); // 관심 지수 80% 이상
    } else {
      setHorseBalloonVisible(false); // todo: 관심지수 확인해서 80% 이상이면 하트 띄우기?
    }
  }, [currentTtubeotStatus, affectionPoints]);

  useEffect(() => {
    setTimeout(() => {
      setWebviewOpacity(1);
    }, 550);
  }, []);

  useEffect(() => {
    const fetchCoinInfo = async () => {
      const updatedUserInfo = await getInfoApi(accessToken, setAccessToken);
      if (updatedUserInfo) {
        setUser({ ...user, coin: updatedUserInfo.userCoin });
      }
    };

    fetchCoinInfo();
  }, [accessToken, setAccessToken, setUser, user]);

  const fetchUserTtubeot = async () => {
    const res = await getTtubeotDetail(
      user.userId,
      accessToken,
      setAccessToken,
    );
    if (res === null) {
      setTtubeotId(46);
    } else {
      setTtubeotId(res.ttubeotId);
      setUser({ ...user, steps: res.ttubeotScore });
    }
    // console.log('내뚜벗 아이디가 뭔교', ttubeotId);
    sendId(ttubeotId);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserTtubeot();
      fetchInterestInfo();
      sendId(ttubeotId);
      setNowSpinning(false);
    }, [ttubeotId]),
  );

  const fetchInterestInfo = async () => {
    if (ttubeotId !== 46) {
      // ttubeotId가 46이 아닐 때만 호출
      const ttubeotInterestInfo = await getTtubeotInterestApi(
        accessToken,
        setAccessToken,
      );
      if (ttubeotInterestInfo) {
        setAffectionPoints(ttubeotInterestInfo.ttubeotInterest);
        // setAffectionPoints(85);
        setCurrentTtubeotStatus(ttubeotInterestInfo.currentTtubeotStatus);
      } else {
        setAffectionPoints(null);
        setCurrentTtubeotStatus(2); // ttubeotId 46일 때는 기본 2로
      }
    }
  };

  useEffect(() => {
    setWebviewOpacity(0);
    if (!modalVisible && !albumModalVisible) {
      setTimeout(() => {
        sendId(ttubeotId);
        setWebviewOpacity(1);
      }, 150);
    }
  }, [modalVisible, albumModalVisible]);

  const sendId = (id: number) => {
    if (webViewRef.current) {
      if (id > 0 && id <= 46) {
        webViewRef.current.postMessage(
          JSON.stringify({ type: 'changeId', id }),
        );
      } else if (id >= 101 && id <= 145) {
        setTimeout(() => {
          webViewRef.current.postMessage(
            JSON.stringify({ type: 'changeId', id }),
          );
        }, 200);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 배경 이미지 */}
      <Image source={background} style={styles.backgroundImage} />
      <View
        style={[
          ttubeotId === 46
            ? styles.eggContainer
            : styles.ttubeotWebviewContainer,
        ]}>
        {!modalVisible && !albumModalVisible && (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{
              uri: nowSpinning
                ? 'file:///android_asset/renderRunModel.html'
                : 'file:///android_asset/renderModel.html',
            }}
            style={[styles.ttubeotWebview, { opacity: webviewOpacity }]}
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
        )}

        {ttubeotId === 46 && (
          <TouchableOpacity
            style={[
              styles.meetingTtubeotButtonContainer,
              { opacity: webviewOpacity },
            ]}
            onPress={openShopModal}>
            <Image
              source={meetingTtubeotButton}
              style={styles.meetingTtubeotButton}
            />
            <StyledText bold style={styles.meetingTtubeotText}>
              뚜벗 만나러 가기
            </StyledText>
          </TouchableOpacity>
        )}
        {/* 말풍선 표시 */}
        {horseBalloonVisible && (
          <TouchableOpacity
            style={[
              ttubeotId === 23 || ttubeotId === 24 || ttubeotId === 45
                ? styles.horseBalloonBigContainer
                : styles.horseBalloonContainer,
            ]}
            onPress={handleBalloonPress}
            disabled={currentTtubeotStatus === 1}>
            <Image
              source={horseBalloon}
              blurRadius={0.8}
              style={styles.horseBalloon}
            />
            <Image
              source={horseBalloonContent}
              blurRadius={0.9}
              style={[
                ttubeotId === 23 || ttubeotId === 24 || ttubeotId === 45
                  ? styles.balloonBigContent
                  : styles.balloonContent,
              ]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 버튼 컨테이너 */}
      {!modalVisible && !missionModalVisible && !albumModalVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openShopModal}>
            <Image source={ShopIcon} style={styles.shopIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMissionModal}>
            <Image source={MissionIcon} style={styles.missionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openFriendsModal}>
            <Image source={FriendIcon} style={styles.albumIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openAlbumModal}>
            <Image source={AlbumIcon} style={styles.albumIcon} />
          </TouchableOpacity>
        </View>
      )}

      {/* 프로필 컨테이너 */}
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>

      <View style={styles.currencyContainer}>
        <CurrencyDisplay />
      </View>

      {ttubeotId !== 46 && (
        <View style={styles.affectionContainer}>
          <AffectionDisplay affectionPoints={affectionPoints} />
        </View>
      )}

      {/* 모달 컴포넌트 */}
      <CharacterShopModal
        modalVisible={modalVisible}
        closeShopModal={closeShopModal}
      />
      <WarningModal visible={warningModalVisible} />

      <MissionModal
        missionModalVisible={missionModalVisible}
        closeMissionModal={closeMissionModal}
      />

      <AlbumModal
        modalVisible={albumModalVisible}
        closeAlbumModal={closeAlbumModal}
      />

      <FriendsModal
        modalVisible={friendsModalVisible}
        closeFriendsModal={closeFriendsModal}
      />
      <BLEModal modalVisible={BLEModalVisible} closeBLEModal={closeBLEModal} />
    </SafeAreaView>
  );
};

export default HomeScreen;
