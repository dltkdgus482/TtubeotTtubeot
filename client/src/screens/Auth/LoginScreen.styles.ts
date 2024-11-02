import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  formContainer: {
    position: 'absolute',
    top: 300,
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  loginButton: {
    marginTop: 32,
  },
});
