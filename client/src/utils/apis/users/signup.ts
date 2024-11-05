import axios from 'axios';
import { defaultRequest } from '../request';
import { Alert } from 'react-native';

// 정규식 상수
const phoneRegex = /^\d{10,11}$/; // 10~11자리 숫자로만 이루어진 휴대전화 번호
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,15}$/; // 영문, 숫자를 포함한 6~15자 조합의 비밀번호
const nicknameRegex = /^[가-힣a-zA-Z]{2,8}$/; // 한글 또는 영어로 이루어진 2~8자의 닉네임

// 유효성 검사 함수
export const validatePhone = phone => phoneRegex.test(phone);
export const validatePassword = password => passwordRegex.test(password);
export const validateNickname = nickname => nicknameRegex.test(nickname);

// export const signUpValidation = (
//   isAuthenticated,
//   userPhone,
//   password,
//   passwordCheck,
//   nickname
// ) => {
//   if (isAuthenticated === false) {
//     Alert.alert('휴대전화 번호 인증을 먼저 해주세요.');
//     return false;
//   }

//   if (!validatePhone(userPhone)) {
//     Alert.alert('휴대전화 번호는 10~11자리의 숫자만 입력해야 합니다.');
//     return false;
//   }

//   if (password !== passwordCheck) {
//     Alert.alert('비밀번호가 일치하지 않습니다.');
//     return false;
//   }

//   if (!validatePassword(password)) {
//     Alert.alert('비밀번호는 영문자와 숫자를 포함한 6자 이상 15자 이하로 입력해야 합니다.');
//     return false;
//   }

//   if (!validateNickname(nickname)) {
//     Alert.alert('닉네임은 2~8자의 한글 또는 영문자로 이루어져야 합니다.');
//     return false;
//   }

//   return true;
// };

// 닉네임 중복 확인 api
// [GET] '/user/check-username?username={username}'
export const userNameValidateApi = async (userName: string) => {
  try {
    const userNameValidateRes = await defaultRequest.get(
      `/user/check-username?username=${userName}`,
    );

    Alert.alert('사용 가능한 닉네임입니다.');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      Alert.alert('이미 사용중인 닉네임입니다.');
      return false;
    } else {
      console.error('닉네임 중복 확인 요청 중 오류 발생:', error);
      Alert.alert('닉네임 중복 확인에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  }
};

// 문자 인증 요청 api
// '[POST] /user/sms-verification/request'
export const requestSmsVerificationApi = async (userPhone: string) => {
  try {
    const smsRequestRes = await defaultRequest.post(
      '/user/sms-verification/request',
      {
        phone: userPhone,
      },
    );

    if (smsRequestRes.status === 200) {
      return true;
    } else {
      throw new Error('문자 인증 요청 실패');
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      Alert.alert('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
    } else {
      console.error('문자 인증 요청 중 오류 발생:', error);
      Alert.alert('문자 인증 요청에 실패했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};

// 문자 인증 확인 api
// [POST] '/user/sms-verification/confirm'
export const confirmSmsVerificationApi = async (
  userPhone: string,
  code: string,
) => {
  try {
    const confirmRes = await defaultRequest.post(
      '/user/sms-verification/confirm',
      {
        phone: userPhone,
        code: code,
      },
    );

    if (confirmRes.status === 200) {
      // Alert.alert('인증 번호가 성공적으로 확인되었습니다.');
      return true;
    } else {
      throw new Error('인증 번호 확인 실패');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Alert.alert('잘못된 인증 번호입니다. 다시 확인해주세요.');
    } else if (error.response && error.response.status === 404) {
      Alert.alert(
        '해당 전화번호로 인증 요청을 찾을 수 없습니다. 다시 시도해주세요.',
      );
    } else {
      console.error('인증 번호 확인 중 오류 발생:', error);
      Alert.alert('인증 번호 확인에 실패했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};

// 회원가입 api
// [POST] '/user/signup'

export const signUpApi = async (formData) => {
  try {
    const signUpRes = await defaultRequest.post('/user/signup', formData);

    if (signUpRes.status === 200) {
      Alert.alert('회원가입에 성공했습니다.');
      return true;
    } else {
      throw new Error('회원가입 실패');
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      Alert.alert('이미 존재하는 아이디 또는 휴대전화 번호입니다.');
    } else if (error.response && error.response.status === 401) {
      Alert.alert(
        '전화번호 인증이 완료되지 않았습니다. 인증 후 다시 시도해주세요.',
      );
    } else {
      console.error('회원가입 요청 중 오류 발생:', error);
      Alert.alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
    return false;
  }
};
