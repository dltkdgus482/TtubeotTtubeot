import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './JournalScreen.styles';
import StyledText from '../../styles/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import JournalDetail from './JournalDetail';
import { getJournalList } from '../../utils/apis/Journal/Journal';
import { useUser } from '../../store/user';
import ButtonFlat from '../../components/Button/ButtonFlat';
import { JournalData } from '../../types/JournalData';

const testPic = require('../../assets/images/MockTtubeotPicture.png');

const JournalScreen = () => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [journalList, setJournalList] = useState<JournalData[]>([]);
  const [selectedJournalId, setSelectedJournalId] = useState<number | null>(
    null,
  );

  const loadJournalList = async () => {
    try {
      const res = await getJournalList(accessToken, setAccessToken);
      if (res) {
        console.log('response', res);
      }
      setJournalList(res);
    } catch (err) {
      console.error(err);
    }
  };

  const openJournalDetail = (id: number) => {
    setSelectedJournalId(id);
  };

  const closeJournalDetail = () => {
    setSelectedJournalId(null);
  };

  useEffect(() => {
    loadJournalList();
  }, []);

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
          {journalList.length > 0 ? (
            <>
              <View style={styles.titleContainer}>
                <StyledText bold color="white" style={styles.title}>
                  모험일지
                </StyledText>
                <StyledText color="white" style={styles.adventureCount}>
                  총 {journalList.length}번의 모험을 다녀왔어요!
                </StyledText>
              </View>
              <View style={styles.journalContainer}>
                {journalList.map(journal => (
                  <TouchableOpacity
                    key={journal.adventure_log_id}
                    style={styles.journalCard}
                    onPress={() => openJournalDetail(journal.adventure_log_id)}>
                    <View style={styles.journalCardBackground} />
                    <Image style={styles.journalPicture} source={testPic} />
                    <View style={styles.journalTitle}>
                      <StyledText bold>{journal.start_at}</StyledText>
                    </View>
                    <View style={styles.journalSubTitle}>
                      <StyledText bold numberOfLines={1} ellipsizeMode="tail">
                        우리마루와 함께한 모험 기록
                      </StyledText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.titleContainer}>
              <StyledText color="white" style={styles.adventureCount}>
                아직 모험 기록이 없어요!
              </StyledText>
            </View>
          )}
          <View style={styles.journalBottomMargin} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default JournalScreen;
