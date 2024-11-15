import React from 'react';
import { Image, View, Modal, TouchableOpacity } from 'react-native';
import styles from './FriendRequestModal.styles';
import StyledText from '../../styles/StyledText';
import styled from 'styled-components/native';
import ButtonFlat from '../Button/ButtonFlat';

interface NfcTaggingProps {
  visible: boolean;
  onClose: () => void;
  bluetoothId: string;
  content1: string;
  content2: string;
}

const ProfileImageContainer = styled(View)`
  width: 75px;
  height: 75px;
  border-radius: 50px;
  background-color: #e9e9e9;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(Image)`
  width: 70px;
  height: 70px;
`;

const profileImageSource = require('../../assets/ttubeot/mockTtu.png');

const FriendRequestModal: React.FC<NfcTaggingProps> = ({
  visible,
  onClose,
  bluetoothId,
  content1,
  content2,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.tagModalContainer}>
        <TouchableOpacity style={styles.tagModalBackground} onPress={onClose} />
        <View style={styles.tagModal}>
          <View style={styles.tagTitleContainer}>
            <StyledText bold style={styles.tagTitle}>
              뚜벗 친구 요청
            </StyledText>
            <StyledText bold style={styles.tagSubTitle}>
              {bluetoothId}
              {content1}
            </StyledText>
          </View>
          <View style={styles.profileContainer}>
            <ProfileImageContainer>
              <ProfileImage source={profileImageSource} />
            </ProfileImageContainer>
            <StyledText bold style={styles.nameStyle}>
              {content2}
            </StyledText>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose}>
              <ButtonFlat
                content="닫기"
                color="#E9E9E9"
                borderRadius={25}
                shadowDisplay={false}
                width={120}
                height={50}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FriendRequestModal;
