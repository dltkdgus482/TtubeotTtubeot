import React from 'react';
import {View, Modal, Text, Button} from 'react-native';
import styles from './CharacterShopModal.styles';

interface CharacterShopModalProps {
  modalVisible: boolean;
  closeShopModal: () => void;
}

const CharacterShopModal: React.FC<CharacterShopModalProps> = ({
  modalVisible,
  closeShopModal,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      // 뒤로 가기 버튼으로 모달을 닫을 수 있도록 설정
      onRequestClose={closeShopModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Text style={styles.modalText}>Welcome to the Shop!</Text>
          <Button title="Close Shop" onPress={closeShopModal} />
        </View>
      </View>
    </Modal>
  );
};

export default CharacterShopModal;
