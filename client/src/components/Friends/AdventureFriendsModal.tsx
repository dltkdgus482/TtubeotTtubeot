import React from 'react';
import { View, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import styles from './AdventureFriendsModal.styles';
import StyledText from '../../styles/StyledText';
import AdventureFriendsList from './AdventureFriendsList';
import { distance } from 'three/webgpu';

interface UserProps {
  userId: number;
  distance: number;
}

interface AdventureFriendModalParams {
  modalVisible: boolean;
  closeFriendsModal: () => void;
  friends: UserProps[];
  requestFriend: (opponentUserId: number) => void;
}

const AdventureFriendsModal = ({
  modalVisible,
  closeFriendsModal,
  friends,
  requestFriend,
}: AdventureFriendModalParams) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeFriendsModal}>
      <TouchableWithoutFeedback onPress={closeFriendsModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <View style={styles.modalTitleContainer}>
              <StyledText bold style={styles.modalTitle}>
                주변 사용자 목록
              </StyledText>
            </View>
            <View style={styles.friendsContainer}>
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <AdventureFriendsList
                    key={index}
                    friend={friend}
                    index={index}
                    requestFriend={requestFriend}
                  />
                ))
              ) : (
                <StyledText bold>근처에 사용자가 없습니다..</StyledText>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AdventureFriendsModal;
