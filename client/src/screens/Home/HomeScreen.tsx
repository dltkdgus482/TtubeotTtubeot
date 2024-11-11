import React, { useEffect, useRef, useState } from 'react';
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
import ButtonFlat from '../../components/Button/ButtonFlat.tsx';
import { getAlbumInfoApi } from '../../utils/apis/Album/getAlbumInfo.ts';
import { useUser } from '../../store/user.ts';
import { getTtubeotDetail } from '../../utils/apis/users/userTtubeot.ts';

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');
const FriendIcon = require('../../assets/icons/FriendIcon.png');
const MapIcon = require('../../assets/icons/MapIcon.png');

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const { ttubeotId, setTtubeotId, user, accessToken, setAccessToken } =
    useUser.getState();
  const [modalVisible, setModalVisible] = useState(false);
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [missionModalVisible, setMissionModalVisible] = useState(false);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const navigation = useNavigation();
  const [BLEModalVisible, setBLEModalVisible] = useState(false);
  const [characterList, setCharacterList] = useState([]);
  const { accessToken, setAccessToken } = useUser.getState();

  const webViewRef = useRef(null);
  const [inputValue, setInputValue] = useState<any>(46);

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
    if (user) {
      const fetchUserTtubeot = async () => {
        const res = await getTtubeotDetail(
          user.userId,
          accessToken,
          setAccessToken,
        );
        if (res === null) {
          setTtubeotId(46);
        } else {
          setTtubeotId(res.ttubeot_type);
        }
      };
      fetchUserTtubeot();
    }
  }, [user]);

  useEffect(() => {
    sendId(ttubeotId);
  }, [ttubeotId]);

  const sendId = (id: number) => {
    if (webViewRef.current && id > 0 && id <= 46) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'changeId', id }));
    }
  };

  const fetchAlbumData = async () => {
    try {
      // 기본 배열 생성 (45개의 뚜벗)
      const defaultList = Array.from({ length: 45 }, (_, index) => ({
        ttubeotName: `뚜벗${index + 1}`,
        ttubeotScore: 0,
        breakUp: null,
        createdAt: '',
        ttubeotId: index + 1,
        ttubeotStatus: -1, // 기본값 -1로 설정 (0: 현재 보유 중, 1: 졸업, 2: 중퇴)
        adventureCount: 0,
      }));

      const response = await getAlbumInfoApi(accessToken, setAccessToken);
      if (response) {
        const updatedList = defaultList.map(character => {
          const apiCharacter = response.ttubeotGraduationInfoDtoList.find(
            item => item.ttubeotId === character.ttubeotId,
          );
          return apiCharacter
            ? {
                ...character,
                ttubeotName: apiCharacter.ttubeotName,
                ttubeotScore: apiCharacter.ttubeotScore,
                breakUp: apiCharacter.breakUp,
                createdAt: apiCharacter.createdAt,
                ttubeotStatus: apiCharacter.ttubeotStatus,
                adventureCount: apiCharacter.adventureCount,
              }
            : character;
        });

        setCharacterList(updatedList); // 업데이트된 리스트 설정
      }
    } catch (error) {
      console.error('앨범 데이터를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  useEffect(() => {
    fetchAlbumData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 배경 이미지 */}
      <Image source={background} style={styles.backgroundImage} />
      {isFocused && (
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
        </View>
      )}

      {/* 버튼 컨테이너 */}
      {!modalVisible && !missionModalVisible && !albumModalVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openShopModal}>
            <Image source={ShopIcon} style={styles.shopIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMissionModal}>
            <Image source={MissionIcon} style={styles.missionIcon} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={openBLEModal}>
            <Image source={AlbumIcon} style={styles.albumIcon} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={openFriendsModal}>
            <Image source={FriendIcon} style={styles.albumIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openAlbumModal}>
            <Image source={AlbumIcon} style={styles.albumIcon} />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ position: 'absolute', top: 200, left: '50%' }}>
        <StyledTextInput
          value={inputValue}
          onChangeText={setInputValue}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => sendId(inputValue)}>
          <ButtonFlat content="변경" />
        </TouchableOpacity>
      </View>

      {/* 프로필 컨테이너 */}
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>

      <View style={styles.currencyContainer}>
        <CurrencyDisplay />
      </View>

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
        characterList={characterList}
      />

      <FriendsModal
        modalVisible={friendsModalVisible}
        closeFriendsModal={closeFriendsModal}
      />
      <BLEModal modalVisible={BLEModalVisible} closeBLEModal={closeBLEModal} />
      {/* WebView로 3D 모델 표시 */}
    </SafeAreaView>
  );
};

export default HomeScreen;
