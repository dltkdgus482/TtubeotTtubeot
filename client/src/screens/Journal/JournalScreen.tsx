import React, { useState, useEffect, useCallback } from 'react';
import { Image, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native'; // useFocusEffect 추가
import styles from './JournalScreen.styles';
import StyledText from '../../styles/StyledText';
import JournalDetail from './JournalDetail';
import {
  getJournalCount,
  getJournalList,
} from '../../utils/apis/Journal/Journal';
import { useUser } from '../../store/user';
import { JournalData } from '../../types/JournalData';
import { getPostposition } from '../../utils/libs/postPosition';

const testPic = require('../../assets/images/JournalImageNotCreated.png');

const JournalScreen = () => {
  const { accessToken, setAccessToken } = useUser.getState();
  const [journalList, setJournalList] = useState<JournalData[]>([]);
  const [selectedJournalId, setSelectedJournalId] =
    useState<JournalData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const loadJournalList = async (page: number, reset = false) => {
    setRefreshing(true);
    try {
      let response: JournalData[];
      if (reset) {
        response = await getJournalList(accessToken, setAccessToken, 1);
      } else {
        response = await getJournalList(accessToken, setAccessToken, page);
      }

      if (response) {
        // response.forEach((item, index) => {
        //   console.log(`Item at index ${index}:`, item);
        // });
        if (response.length === 9) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        // console.log('load', page, reset, response);
      }

      if (reset) {
        setJournalList(response);
      } else {
        setJournalList(prev => [...prev, ...response]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await loadJournalList();
  //   setRefreshing(false); // 새로고침 완료
  // };

  const openJournalDetail = (journal: JournalData) => {
    setSelectedJournalId(journal);
  };

  const closeJournalDetail = () => {
    setSelectedJournalId(null);
  };

  // 화면이 포커스될 때 새로고침
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      // getJournalCount(accessToken, setAccessToken);
    }, []),
  );

  const renderJournalCard = ({ journal }: { journal: JournalData }) =>
    journal && (
      <>
        <TouchableOpacity
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
      </>
    );

  const loadMoreJournalList = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    loadJournalList(page, page === 1);
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
      {selectedJournalId ? (
        <JournalDetail
          journal={selectedJournalId}
          closeJournalDetail={closeJournalDetail}
        />
      ) : (
        <View style={styles.scrollContainer}>
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
                {!refreshing && (
                  <FlatList
                    data={journalList}
                    renderItem={({ item }) =>
                      renderJournalCard({ journal: item })
                    }
                    keyExtractor={item => item.adventure_log_id.toString()}
                    numColumns={3}
                    contentContainerStyle={[
                      styles.journalCard,
                      { paddingBottom: 300 },
                    ]}
                    onEndReached={loadMoreJournalList}
                    onEndReachedThreshold={0.5}
                  />
                )}
              </View>
            </>
          ) : (
            <View style={styles.titleContainer}>
              <StyledText color="white" style={styles.adventureCount}>
                아직 모험 기록이 없어요!
              </StyledText>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default JournalScreen;
