import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import styles from './CameraModal.styles';
import StyledText from '../../styles/StyledText';
import TreasureSceneAR from '../../scenes/TreasureSceneAR';
import WebView from 'react-native-webview';
import { useUser } from '../../store/user';
import useTreasureStore from '../../store/treasure';

type CameraModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
  isARMode: boolean;
};

const CameraModal = ({
  modalVisible,
  closeModal,
  isARMode,
}: CameraModalProps) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { isDigging } = useTreasureStore();
  const { ttubeotId } = useUser();
  const [nowTouching, setNowTouching] = useState<boolean>(false);
  const [webviewOpacity, setWebviewOpacity] = useState<number>(0);
  const webViewRef = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };
    if (modalVisible) {
      requestPermissions();
    }
  }, [modalVisible, hasPermission]);

  const handleTouchStart = () => {
    setNowTouching(true);
  };

  const handleTouchEnd = () => {
    setNowTouching(false);
    setWebviewOpacity(0);
  };

  const sendId = (id: number) => {
    if (webViewRef.current && id > 0 && id <= 46) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'changeId', id }));
    }
  };

  useEffect(() => {
    if (nowTouching) {
      setTimeout(() => {
        sendId(ttubeotId);
        setTimeout(() => {
          setWebviewOpacity(1);
        }, 200);
      }, 500);
    }
  }, [nowTouching]);

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.closeButtonContainer}>
          <Pressable onPress={closeModal}>
            <StyledText bold color="black" style={styles.closeButton}>
              X
            </StyledText>
          </Pressable>
        </View>
        {isARMode && hasPermission && (
          <View
            style={styles.cameraContainer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}>
            <ViroARSceneNavigator
              initialScene={{ scene: TreasureSceneAR }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
        {nowTouching && isDigging && (
          <View style={styles.ttubeotWebviewContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ uri: 'file:///android_asset/renderRunModel.html' }}
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
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CameraModal;
