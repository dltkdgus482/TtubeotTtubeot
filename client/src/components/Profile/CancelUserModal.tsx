import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import styles from './CancelUserModal.styles';
import StyledText from '../../styles/StyledText';

type CancelUserModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const CancelUserModal = ({
  modalVisible,
  closeModal,
}: CancelUserModalProps) => {
  const handleCancelUser = () => {
    // TODO: Cancel User logic
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.modalContainer}>
            <StyledText bold style={styles.modalTitle}>
              정말 탈퇴하시겠어요?
            </StyledText>
            <StyledText style={styles.modalContent}>
              회원 탈퇴가 완료되면, 계정은 삭제되며
            </StyledText>
            <StyledText style={styles.modalContent}>
              복구가 불가능합니다.
            </StyledText>
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.cancelButton}>
                <StyledText onPress={closeModal}>취소</StyledText>
              </Pressable>
              <Pressable style={styles.confirmButton}>
                <StyledText
                  color="white"
                  onPress={() => {
                    handleCancelUser;
                  }}>
                  탈퇴
                </StyledText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelUserModal;
