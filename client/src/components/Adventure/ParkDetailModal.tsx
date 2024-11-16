import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Park } from '../../types/Park';
import styles from './ParkDetailModal.styles';
import Icon from 'react-native-vector-icons/AntDesign';
import StyledText from '../../styles/StyledText';

interface ParkDetailProps {
  park: Park;
  modalVisible: boolean;
  closeModal: () => void;
}

const ParkDetailModal = ({
  park,
  modalVisible,
  closeModal,
}: ParkDetailProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <Pressable onPress={closeModal}>
            <View>
              <StyledText>
                공원 이름<StyledText> | </StyledText>
                {park.name}
              </StyledText>
              <StyledText>
                공원까지 거리<StyledText> | </StyledText>
                {Math.floor(park.distance)}
              </StyledText>
              <StyledText>
                찾을 수 있는 보물 수<StyledText> | </StyledText>
                {park.remain_count}
              </StyledText>
            </View>
          </Pressable>
          <Icon
            name="close"
            size={30}
            color="black"
            style={styles.closeButton}
            onPress={closeModal}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ParkDetailModal;
