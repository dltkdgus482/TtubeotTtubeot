export const getPostposition = name => {
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
