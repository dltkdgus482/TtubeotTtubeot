import React from 'react';
import {View, Modal, Text, Button} from 'react-native';
import styles from './GraduationAlbumModal.styels';

interface GraduationAlbumModalProps {
  modalVisible: boolean;
  closeAlbumModal: () => void;
}

const GraduationAlbumModal: React.FC<GraduationAlbumModalProps> = ({
  modalVisible,
  closeAlbumModal,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      // 뒤로 가기 버튼으로 모달을 닫을 수 있도록 설정
      onRequestClose={closeAlbumModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>레전드 졸업 앨범</Text>
          <Button title="Close Shop" onPress={closeAlbumModal} />
        </View>
      </View>
    </Modal>
  );
};

export default GraduationAlbumModal;
