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
