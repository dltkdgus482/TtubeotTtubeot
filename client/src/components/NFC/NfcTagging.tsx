import React from 'react';
import { Image, View, Modal, TouchableOpacity } from 'react-native';
import styles from './NfcTagging.styles';
import StyledText from '../../styles/StyledText';
import styled from 'styled-components/native';
import ButtonFlat from '../Button/ButtonFlat';

interface NfcTaggingProps {
  visible: boolean;
  onClose: () => void;
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

const NfcTagging: React.FC<NfcTaggingProps> = ({ visible, onClose }) => {
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
              뚜벗
            </StyledText>
            <StyledText bold style={styles.tagSubTitle}>
              우리마루님과 태깅하시겠습니까?
            </StyledText>
          </View>
          <View style={styles.profileContainer}>
            <ProfileImageContainer>
              <ProfileImage source={profileImageSource} />
            </ProfileImageContainer>
            <StyledText bold style={styles.nameStyle}>
              우리마루
            </StyledText>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose}>
              <ButtonFlat
                content="수락"
                color="#3E4A3D"
                fontColor="#FFFFFF"
                borderRadius={25}
                shadowDisplay={false}
                width={120}
                height={50}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <ButtonFlat
                content="거절"
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

export default NfcTagging;
