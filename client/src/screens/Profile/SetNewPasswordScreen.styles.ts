import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  formContainer: {
    position: 'absolute',
    top: 300,
    left: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordHint: {
    color: '#3F3F3F',
    fontSize: 12,
    marginTop: -10,
    marginLeft: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  nextButton: {
    marginTop: 80,
  },
});

export default styles;
