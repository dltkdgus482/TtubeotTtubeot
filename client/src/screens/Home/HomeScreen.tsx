import React from 'react';
import {View, Image, ImageBackground} from 'react-native';
import styles from './HomeScreen.styles';

const background = require('../../assets/images/HomeBackground.jpg');

const HomeScreen = () => {
  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.content}></View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;
