import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './JournalScreen.styles';
import StyledText from '../../styles/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import JournalDetail from './JournalDetail';

const testPic = require('../../assets/images/MockTtubeotPicture.png');

const JournalScreen = () => {
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(
    null,
  );

  const openJournalDetail = (id: number) => {
    setSelectedJournalId(id);
  };

  const closeJournalDetail = () => {
    setSelectedJournalId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedJournalId ? (
        <JournalDetail
          id={selectedJournalId}
          closeJournalDetail={closeJournalDetail}
        />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.backgroundCircle} />
          <View style={styles.titleContainer}>
            <StyledText bold color="white" style={styles.title}>
              모험일지
            </StyledText>
            <StyledText color="white" style={styles.adventureCount}>
              총 30번의 모험을 다녀왔어요!
            </StyledText>
          </View>
          <View style={styles.journalContainer}>
            <TouchableOpacity
              style={styles.journalCard}
              onPress={() => {
                openJournalDetail(1);
              }}>
              <View style={styles.journalCardBackground} />
              <Image style={styles.journalPicture} source={testPic} />
              <View style={styles.journalTitle}>
                <StyledText bold>2024-10-30</StyledText>
              </View>
              <View style={styles.journalSubTitle}>
                <StyledText bold numberOfLines={1} ellipsizeMode="tail">
                  우리마루와 함께한 모험 기록
                </StyledText>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.journalBottomMargin} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default JournalScreen;
