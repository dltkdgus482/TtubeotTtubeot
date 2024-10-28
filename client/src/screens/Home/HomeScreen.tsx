import React from 'react';
import { View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';
import styles from './HomeScreen.styles';
import TtubeotProfile from '../../styles/TtubeotProfile';

const background = require('../../assets/images/HomeBackground.jpg');
const ShopIcon = require('../../assets/icons/ShopIcon.png');
const MissionIcon = require('../../assets/icons/MissionIcon.png');
const AlbumIcon = require('../../assets/icons/AlbumIcon.png');

const HomeScreen = () => {
  const handlePress = () => {
    console.log('ShopIcon pressed!');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.backgroundImage}></ImageBackground>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={ShopIcon} style={styles.shopIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Image source={MissionIcon} style={styles.missionIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePress}>
          <Image source={AlbumIcon} style={styles.albumIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <TtubeotProfile />
      </View>
      {/* WebView로 3D 모델 표시 */}
      <WebView
        originWhitelist={['*']}
        source={{ uri: 'file:///android_asset/renderModel.html' }}
        style={styles.ttubeotWebview}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('WebView Start: ', nativeEvent);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView onError: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView onHttpError: ', nativeEvent);
        }}
        onMessage={(event) => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
      />
    </View>
  );
};

export default HomeScreen;
