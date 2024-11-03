import React from 'react';
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

type GetTreasureModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const coinIcon = require('../../assets/icons/coinIcon.png');

const GetTreasureModal = ({
  modalVisible,
  closeModal,
}: GetTreasureModalProps) => {
  const setHasTreasure = useTreasureStore(state => state.setHasTreasure);

  const getTreasure = () => {
    // TODO: 보물 획득하는 로직
    setHasTreasure(false);
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent={true}>
      <View style={styles.modalView}>
        <View style={styles.treasureContainer}>
          <Image source={coinIcon} />
          <StyledText>x 5</StyledText>
        </View>
        <TouchableOpacity onPress={getTreasure}>
          <ButtonFlat content="획득하고 나가기" width={200} height={50} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GetTreasureModal;
