import React, { useState, useEffect } from 'react';
import { View, Modal, Image, TouchableOpacity } from 'react-native';
import styles from './FriendsModal.styles';
import Icon from 'react-native-vector-icons/Ionicons';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../Button/ButtonFlat';
import { getFriendList } from '../../utils/apis/users/getFriendList';
import { useUser } from '../../store/user';
import { removeFriend } from '../../utils/apis/users/getFriendList';

interface FriendsModalProps {
  modalVisible: boolean;
  closeFriendsModal: () => void;
}

interface TtubeotProps {
  ttubeotType: number;
  ttubeotImage: any;
  createAt: string;
  ttubeotScore: number;
  ttubeotName: string;
}

interface FriendProps {
  userId: number;
  username: string;
  userWalk: number | null;
  userTtubeot: TtubeotProps | null;
}

const Backgound = require('../../assets/images/CharacterShopBackground.png');
const TitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const footprint = require('../../assets/icons/FootprintIconDeepGreen.png');
const online = require('../../assets/icons/OnlineIcon.png');
const offline = require('../../assets/icons/OfflineIcon.png');
const mockTtu = require('../../assets/ttubeot/mockTtu.png');
const sendCoin = require('../../assets/icons/sendCoinIcon.png');

const FriendsModal: React.FC<FriendsModalProps> = ({
  modalVisible,
  closeFriendsModal,
}) => {
  const { accessToken, setAccessToken, user } = useUser.getState();
  const [friends, setFriends] = useState<any>([]);

  useEffect(() => {
    if (modalVisible === false) return;

    const fetchFriends = async (): Promise<void> => {
      const res = await getFriendList(accessToken, setAccessToken);
      setFriends(res);
      // console.log(res);
    };

    fetchFriends();
  }, [modalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeFriendsModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.titleBackContainer}>
            <Image source={Backgound} style={styles.titleBackImage} />
          </View>
          <View style={styles.titleContainer}>
            <Image source={TitleContainer} style={styles.titleImage} />
            <StyledText bold style={styles.title}>
              친구
            </StyledText>
            <Icon
              name="close"
              size={30}
              color="black"
              style={styles.closeButton}
              onPress={closeFriendsModal}
            />
          </View>
          <View style={styles.friendsContainer}>
            {friends.map((friend, index) => {
              return (
                <View style={styles.friends} key={index}>
                  <View style={styles.friendImageContainer}>
                    <Image source={mockTtu} style={styles.friendImage} />
                  </View>
                  <View style={styles.friendContentsContainer}>
                    <StyledText bold style={styles.friendNickname}>
                      {friend.username}
                    </StyledText>
                    <View style={styles.footPrintContainer}>
                      <View style={styles.footPrintIconContainer}>
                        <Image
                          source={footprint}
                          style={styles.footPrintIcon}
                        />
                      </View>
                      <StyledText bold style={styles.footPrintText}>
                        오늘 총{' '}
                        {(friend.userWalk !== null
                          ? friend.userWalk
                          : 0
                        ).toLocaleString()}{' '}
                        걸음
                      </StyledText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.sendCoin}
                    onPress={async () => {
                      const res = await removeFriend(
                        user.userId,
                        friend.userId,
                        accessToken,
                        setAccessToken,
                      );

                      if (res === true) {
                        setFriends(prevFriends =>
                          prevFriends.filter(f => f.userId !== friend.userId),
                        );
                      }
                    }}>
                    <ButtonFlat
                      content=""
                      width={50}
                      height={50}
                      borderRadius={60}
                    />
                    <Image source={sendCoin} style={styles.sendCoinIcon} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FriendsModal;
