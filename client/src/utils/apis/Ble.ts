import { PermissionsAndroid, Platform } from 'react-native';

export const stringToByteArray = (str: string): number[] => {
  const byteArray: number[] = [];

  for (let i = 0; i < str.length; i++) {
    byteArray.push(str.charCodeAt(i));
  }

  return byteArray;
};

export const byteArrayToString = (byteArray: number[]): string => {
  return String.fromCharCode(...byteArray);
};

export const requestPermissions = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);
  }
};

export const decimalToAscii = (decimal: number): string => {
  let asciiString: string = '';

  while (decimal > 0) {
    const remainder = decimal % 128;
    asciiString = String.fromCharCode(remainder) + asciiString;
    decimal = Math.floor(decimal / 128);
  }

  return asciiString;
};

export const asciiToDecimal = (asciiString: string): number => {
  let decimal: number = 0;

  for (let i = 0; i < asciiString.length; i++) {
    decimal = decimal * 128 + asciiString.charCodeAt(i);
  }

  return decimal;
};
