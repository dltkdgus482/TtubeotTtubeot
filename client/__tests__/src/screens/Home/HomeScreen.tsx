import React, { useState } from 'react';
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
import TtubeotProfile from '../../components/TtubeotProfile';
import CharacterShopModal from '../../components/CharacterShop/CharacterShopModal';
import AlbumModal from '../../components/Album/AlbumModal';
import MissionModal from '../../components/Mission/MissionModal.tsx';
import WebView from 'react-native-webview';

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [albumModalVisible, setAlbumModalVisible] = useState(false);
  const [missionModalVisible, setMissionModalVisible] = useState(false);

  const openShopModal = () => {
    setModalVisible(true);
  };

  const closeShopModal = () => {
    setModalVisible(false);
  };

  const openAlbumModal = () => {
    setAlbumModalVisible(true);
  };

  const closeAlbumModal = () => {
    setAlbumModalVisible(false);
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
      <WebView
        originWhitelist={['*']}
        source={{ uri: 'file:///android_asset/renderModel.html' }}
        style={styles.ttubeotWebview}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        onLoadStart={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView Start: ', nativeEvent);
        }}
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView onError: ', nativeEvent);
        }}
        onHttpError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView onHttpError: ', nativeEvent);
        }}
        onMessage={event => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
      />
      {/* 버튼 컨테이너 */}
      {!modalVisible && !missionModalVisible && (
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
        missionModalVisible={missionModalVisible}
        closeMissionModal={closeMissionModal}
      />

      <AlbumModal
        modalVisible={albumModalVisible}
        closeAlbumModal={closeAlbumModal}
      />
      {/* WebView로 3D 모델 표시 */}
    </View>
  );
};

export default HomeScreen;
