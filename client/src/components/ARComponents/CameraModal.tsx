import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import styles from './CameraModal.styles';
import StyledText from '../../styles/StyledText';
import TreasureSceneAR from '../../scenes/TreasureSceneAR';

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

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="slide"
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
          <View style={styles.cameraContainer}>
            <ViroARSceneNavigator
              initialScene={{ scene: TreasureSceneAR }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CameraModal;
