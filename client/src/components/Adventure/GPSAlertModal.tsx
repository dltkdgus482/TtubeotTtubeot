import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import styles from './GPSAlertModal.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../Button/ButtonFlat';
import { useNavigation } from '@react-navigation/native';

type GPSAlertModalProps = {
  modalVisible: boolean;
  setIsPressedNextButton: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
};

const GPSAlertModal = ({
  modalVisible,
  setIsPressedNextButton,
  closeModal,
}: GPSAlertModalProps) => {
  const navigation = useNavigation();

  const handlePressSettingButton = () => {
    // TODO: 모험 중인지 상태관리로 빼야 함
    navigation.navigate('Profile');
  };

  const closeModalWithNextButton = () => {
    setIsPressedNextButton(true);
    setTimeout(() => {
      closeModal();
    }, 100);
  };

  const closeModalWithCloseButton = () => {
    setIsPressedNextButton(false);
    setTimeout(() => {
      closeModal();
    }, 100);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <StyledText bold style={styles.modalTitle}>
            모험을 떠나기 전에
          </StyledText>
          <StyledText style={styles.modalContent}>
            위치 정보를 다른 사용자에게
          </StyledText>
          <StyledText style={styles.modalContent}>
            제공하는 것에{' '}
            <StyledText bold style={styles.accent}>
              동의
            </StyledText>
            했습니다.
          </StyledText>
          <Pressable onPress={handlePressSettingButton}>
            <StyledText style={styles.settingButton}>설정 바로가기</StyledText>
          </Pressable>
          <View style={styles.nextButton}>
            <Pressable onPress={closeModalWithNextButton}>
              <ButtonFlat
                content={'다음'}
                color="#3E4A3D"
                fontColor="white"
                width={200}
                borderRadius={24}
                shadowDisplay={false}
              />
            </Pressable>
          </View>
          <Icon
            name="close"
            size={30}
            color="black"
            style={styles.closeButton}
            onPress={closeModalWithCloseButton}
          />
        </View>
      </View>
    </Modal>
  );
};

export default GPSAlertModal;
