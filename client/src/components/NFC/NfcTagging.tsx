import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import styles from './NfcTagging.styles';
import StyledText from '../../styles/StyledText';

interface NfcTaggingProps {
  visible: boolean;
  onClose: () => void;
}

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
          <StyledText bold style={styles.testStyle}>
            Hey
          </StyledText>
        </View>
      </View>
    </Modal>
  );
};

export default NfcTagging;
