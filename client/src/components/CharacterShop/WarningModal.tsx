import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import StyledText from '../../styles/StyledText';

interface WarningModalProps {
  visible: boolean;
}

const WarningModal: React.FC<WarningModalProps> = ({ visible }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <StyledText bold style={styles.modalText}>
            현재 키우고 있는 뚜벗이 있어
          </StyledText>
          <StyledText bold style={styles.modalText}>
            입양을 할 수 없어요!
          </StyledText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 30,
    width: '65%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 3,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1F1F1F',
    lineHeight: 30,
  },
});

export default WarningModal;
