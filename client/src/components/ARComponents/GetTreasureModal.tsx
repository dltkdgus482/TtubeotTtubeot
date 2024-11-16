import React, { useCallback, useEffect } from 'react';
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
import { useUser } from '../../store/user';
import { updateCoin } from '../../utils/apis/users/updateUserInfo';

type GetTreasureModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
};

const coinIcon = require('../../assets/icons/coinIcon.png');

const GetTreasureModal = ({
  modalVisible,
  closeModal,
}: GetTreasureModalProps) => {
  const {
    currentReward,
    treasureCount,
    setCurrentReward,
    setTreasureCount,
    setHasTreasure,
    setNearbyTreasure,
  } = useTreasureStore();

  const getTreasure = () => {
    updateCoin(currentReward);
    setHasTreasure(false);
    setNearbyTreasure(false);
    setCurrentReward(0);
    setTreasureCount(treasureCount + 1);
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  useEffect(() => {
    console.log('currentReward', currentReward);
    console.log('treasureCount', treasureCount);
  }, [currentReward, treasureCount]);

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
