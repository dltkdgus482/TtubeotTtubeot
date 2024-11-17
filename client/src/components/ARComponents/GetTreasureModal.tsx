import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from './GetTreasureModal.styles';
import StyledText from '../../styles/StyledText';
import useTreasureStore from '../../store/treasure';
import ButtonFlat from '../Button/ButtonFlat';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../store/user';
import { updateCoin } from '../../utils/apis/users/updateUserInfo';
import WebView from 'react-native-webview';

type GetTreasureModalProps = {
  modalVisible: boolean;
  ttubeotId: number;
  closeModal: () => void;
};

const coinIcon = require('../../assets/icons/coinIcon.png');
const background = require('../../assets/images/AlbumBackground.png');

const GetTreasureModal = ({
  modalVisible,
  ttubeotId,
  closeModal,
}: GetTreasureModalProps) => {
  const {
    currentReward,
    treasureCount,
    setCurrentReward,
    setTreasureCount,
    setHasTreasure,
    setNearbyTreasure,
  } = useTreasureStore();
  const webViewRef = useRef(null);

  const getTreasure = () => {
    updateCoin(currentReward);
    setHasTreasure(false);
    setNearbyTreasure(false);
    setCurrentReward(0);
    setTreasureCount(treasureCount + 1);
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  useEffect(() => {
    console.log('currentReward', currentReward);
    console.log('treasureCount', treasureCount);
  }, [currentReward, treasureCount]);

  const sendId = (id: number) => {
    if (webViewRef.current && id >= 101 && id <= 145) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'changeId', id }));
      setOpacity(1);
    }
  };

  const [opacity, setOpacity] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      setOpacity(0);
      setTimeout(() => {
        sendId(ttubeotId + 100);
      }, 500);
    }, [ttubeotId, modalVisible]),
  );

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.backgroundContainer}>
            <Image source={background} style={styles.background} />
          </View>
          <View style={styles.titleContainer}>
            <StyledText bold style={styles.title}>
              보물을 획득했어요!
            </StyledText>
          </View>
          <View style={styles.ttubeotWebviewContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ uri: 'file:///android_asset/renderRunModel.html' }}
              style={[styles.ttubeotWebview, { opacity: opacity }]}
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
          <View style={styles.treasureContainer}>
            <Image source={coinIcon} style={styles.treasure} />
            {/* {currentReward !== 0 && <StyledText bold>x {currentReward}</StyledText>} */}
            <StyledText bold style={styles.treasureCount}>
              x 500
            </StyledText>
          </View>
          <TouchableOpacity
            onPress={getTreasure}
            style={styles.closeButtonContainer}>
            <ButtonFlat
              content="획득하고 나가기"
              width={200}
              height={50}
              borderRadius={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GetTreasureModal;
