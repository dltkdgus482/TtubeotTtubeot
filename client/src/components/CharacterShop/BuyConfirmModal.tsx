import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './BuyConfirmModal.styles';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../Button/ButtonFlat';
import { profileColor } from '../ProfileImageUrl';
import { drawTtubeot } from '../../utils/apis/Draw/Draw';
import { useUser } from '../../store/user';
import SetTtubeotNameModal from './SetTtubeotNameModal';

interface BuyConfirmModalProps {
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  onSuccess: (data: TtubeotData) => void;
  ttubeotId: number | null;
  selectedMenu: string;
  type: number;
  grade: number | null;
  price: number;
}

interface TtubeotData {
  ttubeotId: number;
  userTtubeotOwnershipId: number;
}

const CoinIcon = require('../../assets/icons/coinIcon.png');

const BuyConfirmModal = ({
  confirmModalVisible,
  closeConfirmModal,
  onSuccess,
  ttubeotId,
  selectedMenu,
  type,
  grade,
  price,
}: BuyConfirmModalProps) => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [isSetNameModalVisible, setSetNameModalVisible] = useState(false);
  const [ttubeotData, setTtubeotData] = useState<{
    ttubeotId: number;
    userTtubeotOwnershipId: number;
  } | null>(null);

  let modalContent;

  if (selectedMenu === '랜덤') {
    modalContent = '랜덤 입양하시겠습니까?';
  } else if (selectedMenu === '그룹') {
    modalContent = '해당 그룹의 뚜벗을 \n 입양하시겠습니까?';
  } else if (selectedMenu === '확정') {
    modalContent = '해당 뚜벗을 \n 입양하시겠습니까?';
  }

  const buyItem = async () => {
    try {
      const drawTtubeotRes = await drawTtubeot(
        accessToken,
        setAccessToken,
        type,
        price,
        ttubeotId,
        grade,
      );

      if (drawTtubeotRes === false) {
        return;
      }
      const data = {
        ttubeotId: drawTtubeotRes.ttubeotId,
        userTtubeotOwnershipId: drawTtubeotRes.userTtubeotOwnershipId,
      };
      setTtubeotData(data);
      onSuccess(data); // 구매 성공 후 CharacterShopItemList에 전달
      closeConfirmModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('오류', '보유 코인이 부족하여 뚜벗을 뽑을 수 없습니다.');
      }
    }
  };

  useEffect(() => {
    if (ttubeotData) {
      console.log('뚜벗아이디 설정완~~~~', ttubeotData);
      setSetNameModalVisible(true);
    }
  }, [ttubeotData, setTtubeotData]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={confirmModalVisible}
      onRequestClose={closeConfirmModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.modalContainer}>
            <Icon
              name="close"
              size={24}
              color="black"
              style={styles.closeButton}
              onPress={closeConfirmModal}
            />
            <StyledText bold style={styles.modalTitle}>
              {modalContent}
            </StyledText>
            <View style={styles.ttubeotImageContainer}>
              {ttubeotId && (
                <Image
                  source={profileColor[ttubeotId]}
                  style={styles.ttubeotCharacterImage}
                />
              )}
            </View>
            <TouchableOpacity style={styles.buyConfirmButton} onPress={buyItem}>
              {type !== 1 && type !== 3 && (
                <Image source={CoinIcon} style={styles.buyConfirmCoinIcon} />
              )}
              <ButtonFlat
                content={type === 1 || type === 3 ? '확인' : `     ${price}`}
                color="#FBFAF5"
                borderRadius={30}
                width={90}
                height={50}
                fontSize={16}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuyConfirmModal;
