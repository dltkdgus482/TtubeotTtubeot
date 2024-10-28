import React, {useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import styles from './HomeScreen.styles';
import TtubeotProfile from '../../styles/TtubeotProfile';
import CharacterShopModal from '../../components/CharacterShop/CharacterShopModal';
import GraduationAlbumModal from '../../components/GraduationAlbum/GraduationAlbumModal';
import MissionModal from '../../components/Mission/MissionModal.tsx';

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [graduationAlbumModalVisible, setGraduationAlbumModalVisible] =
    useState(false);
  const [missionModalVisible, setMissionModalVisible] = useState(false);

  const openShopModal = () => {
    setModalVisible(true);
  };

  const closeShopModal = () => {
    setModalVisible(false);
  };

  const openAlbumModal = () => {
    setGraduationAlbumModalVisible(true);
  };

  const closeAlbumModal = () => {
    setGraduationAlbumModalVisible(false);
  };

  const openMissionModal = () => {
    setMissionModalVisible(true);
  };

  const closeMissionModal = () => {
    setMissionModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 배경 이미지 */}
      <ImageBackground
        source={background}
        style={styles.backgroundImage}></ImageBackground>

      {/* 버튼 컨테이너 */}
      {!modalVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openShopModal}>
            <Image source={ShopIcon} style={styles.shopIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openMissionModal}>
            <Image source={MissionIcon} style={styles.missionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openAlbumModal}>
            <Image source={AlbumIcon} style={styles.albumIcon} />
          </TouchableOpacity>
        </View>
      )}

      {/* 프로필 컨테이너 */}
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>

      {/* 모달 컴포넌트 */}
      <CharacterShopModal
        modalVisible={modalVisible}
        closeShopModal={closeShopModal}
      />

      <MissionModal
        modalVisible={missionModalVisible}
        closeMissionModal={closeMissionModal}
      />

      <GraduationAlbumModal
        modalVisible={graduationAlbumModalVisible}
        closeAlbumModal={closeAlbumModal}
      />
    </View>
  );
};

export default HomeScreen;
