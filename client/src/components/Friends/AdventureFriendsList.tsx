import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from './AdventureFriendsModal.styles';
import StyledText from '../../styles/StyledText';
import { useUser } from '../../store/user';
import { getUserInfo } from '../../utils/apis/users/userInfo';

const mockTtu = require('../../assets/ttubeot/mockTtu.png');
const sendCoin = require('../../assets/icons/sendCoinIcon.png');

interface UserProps {
  userId: number;
  distance: number;
}

interface AdventureFriendsListParams {
  friend: UserProps;
  index: number;
  requestFriend: (opoonentUserId: number) => void;
}

const AdventureFriendsList = ({
  friend,
  index,
  requestFriend,
}: AdventureFriendsListParams) => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo({
          accessToken,
          setAccessToken,
          userId: friend.userId,
        });
        setUsername(res.username);
      } catch (error) {
        console.log('fetchUserInfo Error', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.friendContainer}>
      <View style={styles.leftContainer}>
        <Image source={mockTtu} style={styles.friendImage} />
        <View style={styles.friendInfoContainer}>
          <StyledText bold style={styles.username}>
            {username}
          </StyledText>
          <StyledText bold style={styles.distance}>
            {friend.distance.toLocaleString()} m
          </StyledText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.rightContainer}
        onPress={() => {
          requestFriend(friend.userId);
        }}>
        <Image source={sendCoin} style={styles.coinImage} />
      </TouchableOpacity>
    </View>
  );
};

export default AdventureFriendsList;
