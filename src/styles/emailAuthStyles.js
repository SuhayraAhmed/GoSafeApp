import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  authButton: {
    backgroundColor: '#5B9BFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#B8D1FF',
  },
  authButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  switchButton: {
    padding: 12,
    marginBottom: 8,
  },
  switchButtonText: {
    color: '#5B9BFF',
    textAlign: 'center',
    fontSize: 14,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});