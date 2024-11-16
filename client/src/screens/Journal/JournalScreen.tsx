import React, { useState, useEffect, useCallback } from 'react';
import { Image, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; // useFocusEffect 추가
import styles from './JournalScreen.styles';
import StyledText from '../../styles/StyledText';
import JournalDetail from './JournalDetail';
import { getJournalList } from '../../utils/apis/Journal/Journal';
import { useUser } from '../../store/user';
import { JournalData } from '../../types/JournalData';

const testPic = require('../../assets/images/JournalImageNotCreated.png');

const JournalScreen = () => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [journalList, setJournalList] = useState<JournalData[]>([]);
  const [selectedJournalId, setSelectedJournalId] =
    useState<JournalData | null>(null);
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 관리

  const loadJournalList = async () => {
    try {
      const res = await getJournalList(accessToken, setAccessToken);
      if (res) {
        console.log('---------- 모험일지 로딩 ----------', res);
      }
      setJournalList(res);
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJournalList();
    setRefreshing(false); // 새로고침 완료
  };

  const openJournalDetail = (journal: JournalData) => {
    setSelectedJournalId(journal);
  };

  const closeJournalDetail = () => {
    setSelectedJournalId(null);
  };

  const getPostposition = name => {
    const lastChar = name[name.length - 1];
    const isKorean = /[가-힣]/.test(lastChar); // 마지막 글자가 한글인지 확인
    const isEnglish = /[a-zA-Z]/.test(lastChar); // 마지막 글자가 영어인지 확인

    if (isKorean) {
      // 한글 음절의 유니코드 확인
      const lastCharCode = lastChar.charCodeAt(0);
      const jongseong = (lastCharCode - 0xac00) % 28; // 받침 여부 확인
      return jongseong === 0 ? '와' : '과';
    } else if (isEnglish) {
      // 영어일 경우 모음(A, E, I, O, U) 확인 (대소문자 모두 처리)
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      return vowels.includes(lastChar.toLowerCase()) ? '와' : '과';
    }

    // 한글/영어가 아닌 경우 기본적으로 "과" 반환
    return '과';
  };

  // 화면이 포커스될 때 새로고침
  useFocusEffect(
    useCallback(() => {
      loadJournalList();
    }, []), // 의존성 배열을 비워 포커스될 때마다 실행
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedJournalId ? (
        <JournalDetail
          journal={selectedJournalId}
          closeJournalDetail={closeJournalDetail}
        />
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.backgroundCircle} />
          {journalList.length > 0 ? (
            <>
              <View style={styles.titleContainer}>
                <StyledText bold color="white" style={styles.title}>
                  모험 발자취
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
                    onPress={() => openJournalDetail(journal)}>
                    <View style={styles.journalCardBackground} />
                    <Image
                      style={styles.journalPicture}
                      source={
                        journal.image_urls && journal.image_urls.length > 0
                          ? { uri: journal.image_urls[0] }
                          : testPic
                      }
                      resizeMethod="resize"
                    />

                    <View style={styles.journalTitle}>
                      <StyledText bold>{journal.start_at}</StyledText>
                    </View>
                    <View style={styles.journalSubTitle}>
                      <StyledText bold numberOfLines={1} ellipsizeMode="tail">
                        {journal.ttubeot_name}
                        {getPostposition(journal.ttubeot_name)} 함께한 모험 기록
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
