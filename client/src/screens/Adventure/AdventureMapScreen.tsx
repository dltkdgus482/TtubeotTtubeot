import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './AdventureMapScreen.styles';
import StyledText from '../../styles/StyledText';

const AdventureMapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.map}></View>
      </View>
    </SafeAreaView>
  );
};

export default AdventureMapScreen;
