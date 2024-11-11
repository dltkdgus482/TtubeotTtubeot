export const formatLocalDateTime = (localDateTime: string | null): string => {
  if (!localDateTime) {
    return '';
  }

  try {
    const [datePart] = localDateTime.split('T');
    const [year, month, day] = datePart.split('-');
    return `${year}.${month}.${day}`;
  } catch (e) {
    console.error('날짜 변환 중 오류 발생:', e);
    return '';
  }
};
