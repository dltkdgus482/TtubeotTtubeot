import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import StyledText from '../../styles/StyledText';
import StyledTextInput from '../../styles/StyledTextInput';
import ButtonFlat from '../Button/ButtonFlat';
import styles from './SetTtubeotNameModal.styles';
import { confirmTtubeotName } from '../../utils/apis/Draw/Draw';
import { validateNickname } from '../../utils/apis/users/signup';
import { profileColor } from '../ProfileImageUrl';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../store/user';

type SetTtubeotNameModalProps = {
  nameModalVisible: boolean;
  closeNameModal: () => void;
  ttubeotData: { ttubeotId: number; userTtubeotOwnershipId: number } | null;
};

const SetTtubeotNameModal = ({
  nameModalVisible,
  closeNameModal,
  ttubeotData,
}: SetTtubeotNameModalProps) => {
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const { ttubeotId, setTtubeotId } = useUser.getState();

  useEffect(() => {
    setName('');
  }, [nameModalVisible]);

  const handleConfirm = async () => {
    const finalName = name || '뚜벗'; // 기본 이름 뚜벗으로

    if (!validateNickname(finalName)) {
      Alert.alert('닉네임은 2~8자의 한글 또는 영문자로 이루어져야 합니다.');
      return;
    }

    if (ttubeotData?.userTtubeotOwnershipId) {
      try {
        await confirmTtubeotName(ttubeotData.userTtubeotOwnershipId, finalName);
        Alert.alert('성공', '뚜벗 이름 설정이 완료되었습니다.');
        setTtubeotId(ttubeotData.ttubeotId);
        closeNameModal();
      } catch (error) {
        Alert.alert('오류', '뚜벗 이름 설정에 실패했습니다.');
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={nameModalVisible}
      onRequestClose={() => {}} // 뒤로가기 비활성화
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <StyledText bold style={styles.modalTitle}>
            뚜벗 이름 설정
          </StyledText>
          <View style={styles.separator} />
          {ttubeotData && (
            <Image
              source={profileColor[ttubeotData.ttubeotId]}
              style={styles.ttubeotImage}
            />
          )}
          <StyledTextInput
            style={styles.input}
            placeholder="뚜벗의 이름을 입력해주세요"
            placeholderTextColor="#C7C7CD"
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}>
            <StyledText bold style={styles.confirmButtonText}>
              확인
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SetTtubeotNameModal;
