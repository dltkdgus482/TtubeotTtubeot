import { defaultRequest, authRequest } from '../request';
import { JournalData, JournalDetailData } from '../../../types/JournalData';

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0].replace(/-/g, '. ');
};

const calculateDurationInMinutes = (startAt: string, endAt: string) => {
  // KST 시간대를 UTC로 변환
  const startInUTC = new Date(
    new Date(startAt).getTime() - 9 * 60 * 60 * 1000, // KST(GMT+9)를 UTC로 변환
  );

  // UTC 그대로 사용
  const endInUTC = new Date(endAt);

  // 시간 차이 계산
  const differenceInMs = endInUTC.getTime() - startInUTC.getTime();
  return Math.floor(differenceInMs / (1000 * 60));
};

export const getJournalList = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
  page: number = 1,
): Promise<JournalData[]> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(`/adventure/reports?page=${page}&size=9`);
    // console.log(res.data.data);

    const journalList = res.data.data
      // .filter((journal: JournalData) => {
      //   const isValidDistance = journal.adventure_distance >= 3;
      //   const isValidSteps = journal.adventure_steps >= 30;
      //   const isValidDuration =
      //     calculateDurationInMinutes(journal.start_at, journal.end_at) >= 1;
      //   return isValidDistance && isValidSteps && isValidDuration;
      // })
      .map((journal: JournalData) => ({
        ...journal,
        duration: calculateDurationInMinutes(journal.start_at, journal.end_at),
        start_at: formatDate(journal.start_at),
        end_at: formatDate(journal.end_at),
      }));
    return journalList;
  } catch (err) {
    console.error('err :', err);
    return [];
  }
};

export const getJournalDetail = async (
  journalId: number,
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<JournalDetailData> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(`/adventure/reports/${journalId}`);
    const journal = res.data.data;
    // console.log('journal', journal);

    return {
      ...journal,
      duration: calculateDurationInMinutes(journal.start_at, journal.end_at),
      start_at: formatDate(journal.start_at),
      end_at: formatDate(journal.end_at),
    };
  } catch (err) {
    console.error('err :', err);
    return null;
  }
};

export const getJournalCount = async (
  accessToken: string,
  setAccessToken: (accessToken: string) => void,
): Promise<number> => {
  try {
    const authClient = authRequest(accessToken, setAccessToken);
    const res = await authClient.get(`/adventure/reports/size`);
    // console.log('count!!!!!!!!', res.data.data);
    return res.data.data;
  } catch (err) {
    console.error('err :', err);
    return null;
  }
};
