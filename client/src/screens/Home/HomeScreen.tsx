import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  Animated,
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

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');
const FriendIcon = require('../../assets/icons/FriendIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');
const horseBalloon = require('../../assets/images/horseBalloon.png');

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
  const [horseBalloonContent, setHorseBalloonContent] = useState<string>('');

  const webViewRef = useRef(null);

  const openShopModal = () => {
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

  useEffect(() => {
    if (currentTtubeotStatus === 0) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent('🍽'); // 배고픔
    } else if (currentTtubeotStatus === 1) {
      setHorseBalloonVisible(true);
      setHorseBalloonContent('🐾'); // 심심함
    } else {
      setHorseBalloonVisible(false); // 평온 상태일 때는 말풍선을 숨김
    }
  }, [currentTtubeotStatus]);

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
    setUser({ ...user, steps: res.ttubeotScore });
    if (res === null) {
      setTtubeotId(46);
    } else {
      setTtubeotId(res.ttubeotId);
    }
    console.log('내뚜벗 아이디가 뭔교', ttubeotId);
    sendId(ttubeotId);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserTtubeot();
      fetchInterestInfo();
      sendId(ttubeotId);
    }, [user, ttubeotId]),
  );

  // useEffect(() => {
  //   const fetchInterestInfo = async () => {
  //     if (ttubeotId !== 46) {
  //       // ttubeotId가 46이 아닐 때만 호출
  //       const ttubeotInterestInfo = await getTtubeotInterestApi(
  //         accessToken,
  //         setAccessToken,
  //       );
  //       if (ttubeotInterestInfo) {
  //         setAffectionPoints(ttubeotInterestInfo.ttubeotInterest);
  //         setCurrentTtubeotStatus(ttubeotInterestInfo.currentTtubeotStatus);
  //       }
  //     }
  //   };
  //   fetchInterestInfo();
  // }, [ttubeotId, accessToken, setAccessToken]);

  const fetchInterestInfo = async () => {
    if (ttubeotId !== 46) {
      // ttubeotId가 46이 아닐 때만 호출
      const ttubeotInterestInfo = await getTtubeotInterestApi(
        accessToken,
        setAccessToken,
      );
      if (ttubeotInterestInfo) {
        setAffectionPoints(ttubeotInterestInfo.ttubeotInterest);
        setCurrentTtubeotStatus(ttubeotInterestInfo.currentTtubeotStatus);
      }
    }
  };

  const sendId = (id: number) => {
    if (webViewRef.current && id > 0 && id <= 46) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'changeId', id }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 배경 이미지 */}
      <Image source={background} style={styles.backgroundImage} />
      <View style={styles.ttubeotWebviewContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ uri: 'file:///android_asset/renderModel.html' }}
          style={styles.ttubeotWebview}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          onLoadStart={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.log('WebView Start: ', nativeEvent);
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
            console.log('Message from WebView:', event.nativeEvent.data);
          }}
        />
        {/* 말풍선 표시 */}
        {horseBalloonVisible && (
          <View
            style={[
              styles.horseBalloonContainer,
              // { bottom: modelHeight + 30 },
            ]}>
            <Image source={horseBalloon} style={styles.horseBalloon} />
            <StyledText bold style={styles.horseBalloonText}>
              {horseBalloonContent}
            </StyledText>
          </View>
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
