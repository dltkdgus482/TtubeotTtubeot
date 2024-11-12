import React, { useState, useEffect } from 'react';
import { View, Modal, Image, TouchableOpacity } from 'react-native';
import styles from './FriendsModal.styles';
import Icon from 'react-native-vector-icons/AntDesign';
import StyledText from '../../styles/StyledText';
import ButtonFlat from '../Button/ButtonFlat';

const Backgound = require('../../assets/images/CharacterShopBackground.png');
const TitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const footprint = require('../../assets/icons/FootprintIconDeepGreen.png');
const mockTtu = require('../../assets/ttubeot/mockTtu.png');
const sendCoin = require('../../assets/icons/sendCoinIcon.png');

const AdventureFriendsModal = ({
  modalVisible,
  closeFriendsModal,
  friends,
  requestFriend,
}) => {
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
                      {friend.userId}
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
                        {(friend.distance !== null
                          ? friend.distance
                          : 0
                        ).toLocaleString()}{' '}
                        걸음
                      </StyledText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.sendCoin}
                    onPress={() => requestFriend(friend.userId)}>
                    <ButtonFlat
                      content=""
                      width={50}
                      height={50}
                      borderRadius={50}
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

export default AdventureFriendsModal;
