import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './AlbumModal.styels';
import StyledText from '../../styles/StyledText';
import { profileColor, profileBlack } from '../ProfileImageUrl';
import MaskedView from '@react-native-masked-view/masked-view';
import WebView from 'react-native-webview';
import { formatLocalDateTime } from '../../utils/libs/formatDate';

interface AlbumModalProps {
  modalVisible: boolean;
  closeAlbumModal: () => void;
  characterList: Array<{
    ttubeotName: string;
    ttubeotScore: number;
    breakUp: string | null; // 졸업일
    createdAt: string; // 만난 날짜
    ttubeotId: number;
    ttubeotStatus: number; // (0: 현재 보유 중, 1: 졸업, 2: 중퇴)
    adventureCount: number; // 함께한 모험 횟수
  }>;
}

const TitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const TtubeotInfoContainer = require('../../assets/images/AlbumBackground.png');
const AdventureHatIcon = require('../../assets/icons/AdventureHatIcon.png');
const FootprintIcon = require('../../assets/icons/StepFootprintIcon.png');

const AlbumModal: React.FC<AlbumModalProps> = ({
  modalVisible,
  closeAlbumModal,
  characterList,
}) => {
  // console.log('캐릭터!!!!!!!리스트:', characterList);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null,
  );
  const [loadedCount, setLoadedCount] = useState(6);
  const [animationValue] = useState(new Animated.Value(0));
  const [animationOpactiyValue] = useState(new Animated.Value(0));

  const webViewRef = useRef(null);

  const renderCharacter = ({
    item,
  }: {
    item: { ttubeotId: number; ttubeotStatus: number };
  }) => (
    <TouchableOpacity
      onPress={() => {
        handleCharacterSelect(item.ttubeotId);
        sendId(item.ttubeotId);
      }}>
      <Image
        source={
          item.ttubeotStatus !== -1
            ? profileColor[item.ttubeotId]
            : profileBlack[item.ttubeotId]
        }
        style={[
          item.ttubeotStatus !== -1
            ? styles.characterColorImage
            : styles.characterBlackImage,
          item.ttubeotStatus === 2 && { backgroundColor: '#F7DADA' }, // status 중퇴일 때 배경색 다르게
        ]}
      />
    </TouchableOpacity>
  );

  const handleCharacterSelect = (ttubeotId: number) => {
    setSelectedCharacter(ttubeotId);
  };

  const selectedCharacterData =
    characterList.find(char => char.ttubeotId === selectedCharacter) || null;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: selectedCharacter ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(animationOpactiyValue, {
      toValue: selectedCharacter ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
  }, [selectedCharacter, animationValue, animationOpactiyValue]);

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const loadMoreCharacters = () => {
    if (loadedCount < characterList.length) {
      setLoadedCount(prev => prev + 3);
    }
  };

  const sendId = (id: number) => {
    setTimeout(() => {
      if (webViewRef.current && id > 0 && id < 46) {
        const message = JSON.stringify({ type: 'changeId', id });
        webViewRef.current.postMessage(message);
      }
    }, 500);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeAlbumModal}
      onShow={() => setSelectedCharacter(null)}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <MaskedView
            style={{ height: 300, width: '100%', position: 'absolute' }}
            maskElement={
              <View
                style={{
                  backgroundColor: 'black',
                  height: 300,
                  borderTopLeftRadius: 20,
                  overflow: 'hidden',
                }}
              />
            }>
            <Animated.Image
              source={TtubeotInfoContainer}
              style={[
                styles.modalBackgroundImage,
                { transform: [{ translateY }], opacity: opacity },
              ]}
            />
          </MaskedView>
          <View
            style={[
              styles.titleContainer,
              { height: selectedCharacter ? 0 : 70 },
            ]}>
            <Image source={TitleContainer} style={styles.titleImage} />
            <StyledText bold style={styles.title}>
              도감
            </StyledText>
            <Icon
              name="close"
              size={30}
              color="black"
              style={styles.closeButton}
              onPress={closeAlbumModal}
            />
          </View>

          {selectedCharacter &&
            (characterList.find(char => char.ttubeotId === selectedCharacter)
              ?.ttubeotStatus === -1 ? (
              <View style={styles.undiscoveredContainer}>
                <View style={styles.undiscoveredBox}>
                  <View style={styles.undiscoveredTextWrapper}>
                    <StyledText bold style={styles.undiscoveredText}>
                      아직 만나지 않은
                    </StyledText>
                    <StyledText bold style={styles.undiscoveredText}>
                      뚜벗이에요
                    </StyledText>
                  </View>
                  <StyledText style={styles.sadEmoji}>😿</StyledText>
                </View>
              </View>
            ) : (
              <View style={styles.infoContainer}>
                <WebView
                  ref={webViewRef}
                  originWhitelist={['*']}
                  source={{
                    uri: 'file:///android_asset/renderStaticModel.html',
                  }}
                  style={styles.ttubeotWebview}
                  allowFileAccess={true}
                  allowFileAccessFromFileURLs={true}
                  allowUniversalAccessFromFileURLs={true}
                  onLoadStart={syntheticEvent => {
                    const { nativeEvent } = syntheticEvent;
                    console.log('졸업앨범 웹뷰: ', nativeEvent);
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
                    console.log(
                      'Message from WebView:',
                      event.nativeEvent.data,
                    );
                  }}
                />
                <View style={styles.ttubeotInfoContainer}>
                  <StyledText bold style={styles.ttubeotName}>
                    {selectedCharacterData.ttubeotName}
                  </StyledText>
                  {selectedCharacterData.ttubeotStatus === 1 && (
                    <StyledText style={styles.breakUpDate}>
                      {formatLocalDateTime(selectedCharacterData.breakUp)} 수료
                    </StyledText>
                  )}
                  {selectedCharacterData.ttubeotStatus === 0 && (
                    <StyledText style={styles.breakUpDate}>
                      {formatLocalDateTime(selectedCharacterData.createdAt)} ~
                    </StyledText>
                  )}
                  {selectedCharacterData.ttubeotStatus === 2 && (
                    <StyledText style={styles.breakUpDate}>
                      {/* {formatLocalDateTime(selectedCharacterData.breakUp)} 가출 */}
                      수료를 하지 못했어요 😿
                    </StyledText>
                  )}
                  <View style={styles.withInfoWrapper}>
                    <View style={styles.adventureCountContainer}>
                      <Image
                        source={AdventureHatIcon}
                        style={styles.adventureHatIcon}
                      />
                      <StyledText bold style={styles.adventureCountTitle}>
                        함께한 모험
                      </StyledText>
                      <StyledText bold style={styles.adventureCount}>
                        {selectedCharacterData.adventureCount}회
                      </StyledText>
                    </View>
                    <View style={styles.stepCountContainer}>
                      <Image
                        source={FootprintIcon}
                        style={styles.footprintIcon}
                      />
                      <StyledText bold style={styles.adventureCountTitle}>
                        함께한 걸음
                      </StyledText>
                      <StyledText bold style={styles.adventureCount}>
                        {selectedCharacterData.ttubeotScore.toLocaleString()}
                      </StyledText>
                    </View>
                  </View>
                </View>
              </View>
            ))}

          <Animated.View>
            <FlatList
              data={characterList.slice(0, loadedCount)}
              renderItem={renderCharacter}
              keyExtractor={item => item.ttubeotId.toString()}
              numColumns={3}
              contentContainerStyle={[
                styles.characterGrid,
                { paddingBottom: selectedCharacter ? 320 : 80 },
              ]}
              onEndReached={loadMoreCharacters}
              onEndReachedThreshold={0.5}
            />
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default AlbumModal;
