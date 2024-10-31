module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // react-native-dotenv
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env', // import 할 때 명시한 이름으로 가져올 수 있도록 설정
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};

