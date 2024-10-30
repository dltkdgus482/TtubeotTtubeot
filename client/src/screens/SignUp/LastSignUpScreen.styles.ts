import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpButton: {
    marginTop: 60,
  },
  passwordHint: {
    color: '#3F3F3F',
    fontSize: 12,
    marginTop: -24,
    marginLeft: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
});
