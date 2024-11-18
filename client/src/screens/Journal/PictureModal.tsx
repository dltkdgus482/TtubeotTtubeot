import React from 'react';
import { View, Text, Modal, Pressable, Image } from 'react-native';
import styles from './PictureModal.styles';
import Icon from 'react-native-vector-icons/Ionicons';

interface PictureModalProps {
  modalVisible: boolean;
  picture: string;
  closeModal: () => void;
}

const PictureModal = ({
  modalVisible,
  picture,
  closeModal,
}: PictureModalProps) => {
  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent={true}>
      <Pressable onPress={closeModal}>
        <View style={styles.modalView}>
          <Image
            source={{ uri: picture }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export default PictureModal;
