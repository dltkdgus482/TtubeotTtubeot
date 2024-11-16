import React from 'react';
import {
  View,
  Modal,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import styles from './AdventureFriendsModal.styles';
import StyledText from '../../styles/StyledText';
import AdventureFriendsList from './AdventureFriendsList';

interface UserProps {
  userId: number;
  distance: number;
}

interface AdventureFriendModalParams {
  modalVisible: boolean;
  closeFriendsModal: () => void;
  friends: UserProps[];
  requestFriend: (opponentUserId: number) => void;
  isFriendRequestConfirmSent: boolean;
}

const AdventureFriendsModal = ({
  modalVisible,
  closeFriendsModal,
  friends,
  requestFriend,
  isFriendRequestConfirmSent,
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
                주변 모험가 목록
              </StyledText>
            </View>
            <ScrollView style={styles.friendsContainer}>
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <AdventureFriendsList
                    key={index}
                    friend={friend}
                    index={index}
                    requestFriend={requestFriend}
                    isFriendRequestConfirmSent={isFriendRequestConfirmSent}
                  />
                ))
              ) : (
                <StyledText bold>근처에 모험가가 없습니다..</StyledText>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AdventureFriendsModal;
