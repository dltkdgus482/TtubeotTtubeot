import React from 'react';
import {View, Image, ImageBackground, TouchableOpacity} from 'react-native';
import styles from './HomeScreen.styles';
import TtubeotProfile from '../../components/TtubeotProfile';

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
      <View style={styles.content}></View>
    </View>
  );
};

export default HomeScreen;
