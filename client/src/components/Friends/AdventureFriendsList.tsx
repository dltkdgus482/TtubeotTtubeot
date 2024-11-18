import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from './AdventureFriendsModal.styles';
import StyledText from '../../styles/StyledText';
import { useUser } from '../../store/user';
import { getUserInfo } from '../../utils/apis/users/userInfo';
import { isFriend } from '../../utils/apis/users/getFriendList';

const mockTtu = require('../../assets/ttubeot/mockTtu.png');
const sendCoin = require('../../assets/icons/sendCoinIcon.png');
const addFriendIcon = require('../../assets/icons/addFriendIcon.png');

interface UserProps {
  userId: number;
  distance: number;
}

interface AdventureFriendsListParams {
  friend: UserProps;
  index: number;
  requestFriend: (opoonentUserId: number) => void;
  isFriendRequestConfirmSent: boolean;
}

const AdventureFriendsList = ({
  friend,
  index,
  requestFriend,
  isFriendRequestConfirmSent,
}: AdventureFriendsListParams) => {
  const { accessToken, setAccessToken, user } = useUser.getState();
  const [username, setUsername] = useState<string>('');
  const [checkFriend, setCheckFriend] = useState<boolean>(false);
  const userId = user.userId;

  useEffect(() => {
    const checkIsFriend = async () => {
      const res = await isFriend(userId, friend.userId);
      setCheckFriend(res);
    };

    checkIsFriend();
  }, [isFriendRequestConfirmSent]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo({
          accessToken,
          setAccessToken,
          userId: friend.userId,
        });
        // console.log(res);
        setUsername(res.username);
      } catch (error) {
        // console.log('fetchUserInfo Error', error);
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
            {' '}
            나로부터 {friend.distance.toFixed(0)}m
          </StyledText>
        </View>
      </View>
      <TouchableOpacity
        style={styles.rightContainer}
        onPress={() => {
          requestFriend(friend.userId);
        }}>
        <Image
          source={checkFriend ? sendCoin : addFriendIcon}
          style={styles.coinImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AdventureFriendsList;
