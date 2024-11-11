import React from 'react';
import { View, Modal, Pressable, Alert } from 'react-native';
import styles from './CancelUserModal.styles';
import StyledText from '../../styles/StyledText';
import { useUser } from '../../store/user';
import { deleteUserApi } from '../../utils/apis/users';

type CancelUserModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const CancelUserModal = ({
  modalVisible,
  closeModal,
}: CancelUserModalProps) => {
  const { accessToken, setAccessToken, clearUser } = useUser.getState();

  const handleCancelUser = async () => {
    // 회원 탈퇴 API 호출
    const response = await deleteUserApi(accessToken, setAccessToken);

    if (response) {
      // 탈퇴 성공 시 로그아웃 처리 및 모달 닫기
      clearUser();
      closeModal();
      Alert.alert('회원 탈퇴가 완료되었습니다.');
    } else {
      Alert.alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
    }
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
                <StyledText bold color="#7C7C7C" onPress={closeModal}>
                  취소
                </StyledText>
              </Pressable>
              <Pressable style={styles.confirmButton}>
                <StyledText
                  color="white"
                  bold
                  onPress={() => {
                    handleCancelUser();
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
