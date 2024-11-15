import React, { useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { getTreasureRequest } from '../../utils/apis/adventure/GetTreasure';
import { useUser } from '../../store/user';

type GetTreasureModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const coinIcon = require('../../assets/icons/coinIcon.png');

const GetTreasureModal = ({
  modalVisible,
  closeModal,
}: GetTreasureModalProps) => {
  const { currentReward, setHasTreasure, setNearbyTreasure } =
    useTreasureStore();

  const getTreasure = () => {
    setHasTreasure(false);
    setNearbyTreasure(false);
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
          {currentReward !== 0 && <StyledText>x {currentReward}</StyledText>}
        </View>
        <TouchableOpacity onPress={getTreasure}>
          <ButtonFlat content="획득하고 나가기" width={200} height={50} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GetTreasureModal;
